const sequelize = require('../../config/database');
const moment = require('moment');
const {
  Class,
  Schedule,
  Course,
  Classroom,
  Teacher,
  Shift,
  ClassTeacher,
  ClassSchedule,
  Level,
  TeacherLevel,
  ScheduleShift
} = require('../models/index');
const { Op, Model, where } = require('sequelize');
const XLSX = require('xlsx');

class TeacherRepository {
  async uploadSchedule(file) {
    const transaction = await sequelize.transaction();
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      const records = data.slice(1);

      for (const row of records) {
        const teachingShift = row['Thời gian'];
        const courseName = row['Tên khóa học'];
        const classroomName = row['Phòng học'];
        const className = row['Tên lớp'];
        const cmMain = row['CM chính'];
        const cmSub = row['CM phụ'];
        const capacity = row['Học viên trong lớp'];
        const startDate = new Date(row['Ngày bắt đầu'] * 1000);
        const endDate = new Date(row['Ngày kết thúc'] * 1000);

        let level;
        if (courseName) {
          level = await Level.findOne({
            where: { level_name: courseName },
            transaction,
          });
          if (!level) {
            level = await Level.create(
              {
                level_name: courseName,
              },
              { transaction }
            );
          }
        } else {
          console.error('level name not found, skipping this record.');
          continue;
        }

        let classroom;
        if (classroomName) {
          classroom = await Classroom.findOne({
            where: { classroom_name: classroomName },
            transaction,
          });
          if (!classroom) {
            classroom = await Classroom.create(
              {
                classroom_name: classroomName,
                capacity: capacity,
                type: 'Online Room',
              },
              { transaction }
            );
          }
        } else {
          console.error('Classroom name not found, skipping this record.');
          continue;
        }

        let course;
        if (courseName) {
          course = await Course.findOne({
            where: { course_name: courseName },
            transaction,
          });
          if (!course) {
            course = await Course.create(
              { course_name: courseName },
              { transaction }
            );
          }
        } else {
          console.error('Course name not found, skipping this record.');
          continue;
        }

        let classInstance;
        if (className) {
          classInstance = await Class.findOne({
            where: { class_name: className },
            transaction,
          });
          if (!classInstance) {
            classInstance = await Class.create(
              {
                class_name: className,
                start_date: startDate || null,
                end_date: endDate || null,
                classroom_id: classroom.id || null,
                course_id: course.id,
              },
              { transaction }
            );
          }
        } else {
          console.error('Class name not found, skipping this record.');
          continue;
        }

        const cleanTeacherName = (teacherStr) =>
          teacherStr.replace(/\s*\(.*?\)\s*/g, '').trim();

        if (cmMain) {
          const cmMainTeachers = cmMain.split(' - ').map(cleanTeacherName);
          for (const teacherName of cmMainTeachers) {
            let teacher = await Teacher.findOne({
              where: { teacher_name: teacherName },
              transaction,
            });
            if (!teacher) {
              teacher = await Teacher.create(
                {
                  teacher_name: teacherName,
                },
                { transaction }
              );
            }

            const existingRelation = await ClassTeacher.findOne({
              where: {
                class_id: classInstance.id,
                teacher_id: teacher.id,
              },
              transaction,
            });

            if (!existingRelation) {
              await ClassTeacher.create(
                {
                  class_id: classInstance.id,
                  teacher_id: teacher.id,
                  role: 'Giáo Viên Chính',
                },
                { transaction }
              );
            }
          }
        }

        if (cmSub) {
          const cmSubTeachers = cmSub.split(' - ').map(cleanTeacherName);
          for (const teacherName of cmSubTeachers) {
            let teacher = await Teacher.findOne({
              where: { teacher_name: teacherName },
              transaction,
            });
            if (!teacher) {
              teacher = await Teacher.create(
                {
                  teacher_name: teacherName,
                },
                { transaction }
              );
            }
            const existingRelation = await ClassTeacher.findOne({
              where: {
                class_id: classInstance.id,
                teacher_id: teacher.id,
              },
              transaction,
            });

            if (!existingRelation) {
              await ClassTeacher.create(
                {
                  class_id: classInstance.id,
                  teacher_id: teacher.id,
                  role: 'Giáo Viên Phụ',
                },
                { transaction }
              );
            }
          }
        }

        let shift = await Shift.findOne({
          where: { teaching_shift: teachingShift },
          transaction,
        });
        if (!shift) {
          shift = await Shift.create(
            { teaching_shift: teachingShift, class_id: classInstance.id },
            { transaction }
          );
        }

        for (const [key, value] of Object.entries(row)) {
          if (
            ![
              'STT',
              'Thời gian',
              'Tên khóa học',
              'Tên lớp',
              'CM chính',
              'CM phụ',
              'Học viên trong lớp',
              'Ngày bắt đầu',
              'Ngày kết thúc',
              'Phòng học',
            ].includes(key)
          ) {
            const scheduleDate = key;

            const existingSchedule = await Schedule.findOne({
              where: { schedule_date: scheduleDate },
              transaction,
            });

            let scheduleId;
            if (!existingSchedule) {
              const newSchedule = await Schedule.create(
                {
                  schedule_date: scheduleDate,
                  schedules_id: classInstance.id,
                },
                { transaction }
              );
              scheduleId = newSchedule.id;
            } else {
              scheduleId = existingSchedule.id;
            }
            await ScheduleShift.create(
              {
                schedule_id: scheduleId,
                shift_id: shift.id,
              },
              { transaction }
            );
            await ClassSchedule.create(
              {
                class_id: classInstance.id,
                schedule_id: scheduleId,
              },
              { transaction }
            );

            const teacherNamesString = value;
            const teacherEntries = teacherNamesString
              .split('-')
              .map((entry) => entry.trim());

            for (const teacherEntry of teacherEntries) {
              const nameMatch = teacherEntry.match(/^(.*?)(?:\s*\((.*?)\))?$/);
              if (nameMatch) {
                const teacherName = nameMatch[1].trim();
                const role = nameMatch[2] ? nameMatch[2].trim() : null;

                let existingTeacher = await Teacher.findOne({
                  where: { teacher_name: teacherName },
                  transaction,
                });
                if (existingTeacher) {
                  const existingRelationClassTeacher =
                    await ClassTeacher.findOne({
                      where: {
                        teacher_id: existingTeacher.id,
                        class_id: classInstance.id,
                      },
                      transaction,
                    });
                  if (existingRelationClassTeacher) {
                    await ClassTeacher.update(
                      {
                        class_id: existingRelationClassTeacher.class_id,
                        teacher_id: existingRelationClassTeacher.teacher_id,
                        role: role ? role : null,
                      },
                      {
                        where: {
                          id: existingRelationClassTeacher.teacher_id,
                        },
                      },
                      { transaction }
                    );
                  } else {
                    await ClassTeacher.create(
                      {
                        teacher_id: existingTeacher.id,
                        class_id: classInstance.id,
                        role: role ? role : 'Giáo viên Chính',
                      },
                      { transaction }
                    );
                  }
                }
              }
            }
          }
        }
      }

      await transaction.commit();
      console.log('Data has been successfully saved!');
    } catch (error) {
      await transaction.rollback();
      console.error('Error saving data:', error);
    }
  }
  async getTeachers(teacher_name) {
    try {
      const teachers = await Teacher.findOne({
        where: {
          deleted_at: null,
          teacher_name: teacher_name,
        },
        include: [
          {
            model: Level,
            as: 'levels', 
            through: { attributes: [] },
            attributes: ['id', 'level_name'],
          },
        ],
      });

      if (!teachers) {
        return [];
      }

      const levelIds = teachers.levels.map((level) => level.id);

      const sameLevelTeachers = await Teacher.findAll({
        where: {
          teacher_name: {
            [Op.ne]: teacher_name,
          },
          deleted_at: null,
        },
        include: [
          {
            model: Level,
            as: 'levels',
            through: { attributes: [] },
            where: {
              id: {
                [Op.in]: levelIds,
              },
            },
            attributes: ['level_name'],
          },
        ],
        attributes: ['id', 'teacher_name'],
      });

      return sameLevelTeachers.map((teacher) => ({
        name: teacher.teacher_name,
        id: teacher.id,
      }));
    } catch (error) {
      console.error('Error fetching teachers with the same level:', error);
      throw error;
    }
  }


  async getTeacherSchedules(schedule_date) {
    try {
      const result = await Schedule.findAll({
        where: {
          schedule_date: schedule_date,
          deleted_at: null,
        },
        attributes: ['id', 'schedule_date'],
        include: [
          {
            model: Class,
            as: 'classes',
            required: true,
            attributes: ['id', 'class_name'],
            include: [
              {
                model: Teacher,
                as: 'Teachers',
                attributes: ['id', 'teacher_name'],
                through: {
                  attributes: ['role'],
                },
              },
              {
                model: Shift,
                as: 'shifts',
                where: {
                  teaching_shift: { [Op.ne]: null },
                },
                attributes: ['id', 'teaching_shift'],
              },
            ],
          },
        ],
      });

      return result;
    } catch (error) {
      console.error('Error fetching teacher schedules:', error);
      throw error;
    }
  }
  async getTeacherScheduleById(class_id, date) {
    try {
      const schedule = await Schedule.findOne({
        where: {
          schedule_date: date,
          deleted_at: null,
        },
        attributes: ['id', 'schedule_date'],
        include: [
          {
            model: Class,
            as: 'classes',
            required: true,
            attributes: ['id', 'class_name'],
            where: {
              id: class_id,
            },
            include: [
              {
                model: Teacher,
                as: 'Teachers',
                attributes: ['id', 'teacher_name'],
                through: {
                  model: ClassTeacher,
                  attributes: ['teacher_id', 'role'],
                },
              },
              {
                model: Shift,
                as: 'shifts',
                attributes: ['id', 'teaching_shift'],
              },
              {
                model: Classroom,
                as: 'classroom',
                attributes: ['id', 'classroom_name'],
              },
              {
                model: Course,
                as: 'course',
                attributes: ['id', 'course_name'],
              },
            ],
          },
        ],
      });

      if (!schedule) {
        return null;
      }
      const mainTeacher = schedule.classes[0].Teachers[0];
      const teachersWithSameLevel = await this.getTeachers(
        mainTeacher.teacher_name
      );

      return {
        ...schedule.toJSON(),
        sameLevelTeachers: teachersWithSameLevel,
      };
    } catch (error) {
      console.error('Error fetching teacher schedules:', error);
      throw error;
    }
  }
  async updateTeacherScheduleById(class_id, date, updateData) {
    const transaction = await sequelize.transaction();
    try {
      if (!updateData || !updateData.schedule_date) {
        throw new Error('Invalid update data');
      }
      const schedule = await this.getTeacherScheduleById(class_id, date);
      if (!schedule) {
        throw new Error('Schedule not found');
      }

      await Schedule.update(
        {
          schedule_date: updateData.schedule_date,
        },
        {
          where: {
            id: schedule.id,
            deleted_at: null,
          },
          transaction,
        }
      );

      if (updateData.class_name) {
        await Class.update(
          { class_name: updateData.class_name },
          {
            where: { id: schedule.classes[0].id },
            transaction,
          }
        );
      }

      if (updateData.teacher_id) {
        await ClassTeacher.update(
          { teacher_id: updateData.teacher_id },
          {
            where: { teacher_id: schedule.classes[0].Teachers[0].id },
            transaction,
          }
        );
      }

      if (updateData.teaching_shift) {
        await Shift.update(
          { teaching_shift: updateData.teaching_shift },
          {
            where: { id: schedule.classes[0].shifts[0].id },
            transaction,
          }
        );
      }

      if (updateData.classroom_name) {
        await Classroom.update(
          { classroom_name: updateData.classroom_name },
          {
            where: { id: schedule.classes[0].classroom.id },
            transaction,
          }
        );
      }

      if (updateData.course_name) {
        await Course.update(
          { course_name: updateData.course_name },
          {
            where: { id: schedule.classes[0].course.id },
            transaction,
          }
        );
      }

      await transaction.commit();
      return await this.getTeacherScheduleById(
        class_id,
        updateData.schedule_date
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async softDeleteTeacherScheduleById(class_id, date) {
    const transaction = await sequelize.transaction();
    try {
      const schedule = await this.getTeacherScheduleById(class_id, date);
      
      if (!schedule) {
        throw new Error('Schedule not found');
      }
      await ClassSchedule.update(
        {
          deleted_at: new Date(),
          is_deleted: true,
        },
        {
          where: {
            schedule_id: schedule.id,
            class_id: schedule.classes[0].id,
          },
          transaction,
        },
      );
      await Class.update(
        {
          deleted_at: new Date(),
          is_deleted: true,
        },
        {
          where: {
            id: schedule.classes[0].id,
            deleted_at: null,
          },
          transaction,
        }
      );
  
      await ClassTeacher.update(
        {
          deleted_at: new Date(),
          is_deleted: true,
        },
        {
          where: {
            class_id: schedule.classes[0].id,
            deleted_at: null,
          },
          transaction,
        }
      );


      await Shift.update(
        {
          deleted_at: new Date(),
          is_deleted: true,
        },
        {
          where: {
            id: schedule.classes[0].shifts[0].id,
            deleted_at: null,
          },
          transaction,
        }
      );

      await Classroom.update(
        {
          deleted_at: new Date(),
          is_deleted: true,
        },
        {
          where: {
            id: schedule.classes[0].classroom.id,
            deleted_at: null,
          },
          transaction,
        }
      );

      await Course.update(
        {
          deleted_at: new Date(),
          is_deleted: true,
        },
        {
          where: {
            id: schedule.classes[0].course.id,
            deleted_at: null,
          },
          transaction,
        }
      );
   
      await transaction.commit();
      return { message: 'Soft delete completed successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async getDeletedTeacherScheduleAll() {
      try {
        const result = await Class.findAll({
          where: {
            is_deleted: true,
            deleted_at: { [Op.ne]: null },
          },
          attributes: ['id', 'class_name', 'deleted_at', 'is_deleted'],
          include: [
            {
              model: Schedule,
              as: 'schedules',
              through: {
                model: ClassSchedule,
                where: {
                  is_deleted: true,
                  deleted_at: { [Op.ne]: null },
                },
                attributes: [],
              },
              attributes: ['id', 'schedule_date', 'deleted_at', 'is_deleted'],
            },
            {
              model: Teacher,
              as: 'Teachers',
              attributes: ['id', 'teacher_name', 'deleted_at', 'is_deleted'],
              through: {
                model: ClassTeacher,
                where: {
                  is_deleted: true,
                  deleted_at: { [Op.ne]: null },
                },
                attributes: ['role'],
              },
            },
          ],
        });
      return result.length !== 0 ? result : { message: 'No soft delete Teacher Schedule ' } ;
    } catch (error) {
      console.error('Error fetching detailed deleted schedules:', error);
      throw error;
    }
  }
  
  async restoreTeacherScheduleById(class_id, date) {
    const transaction = await sequelize.transaction();
    try {
      const schedule = await this.getTeacherScheduleById(class_id, date);
  
      if (!schedule) {
        throw new Error('Schedule not found');
      }
  
      await ClassSchedule.update(
        {
          deleted_at: null,
          is_deleted: false,
        },
        {
          where: {
            schedule_id: schedule.id,
            class_id: schedule.classes[0].id,
            is_deleted: true,
            deleted_at: { [Op.ne]: null },
          },
          transaction,
        }
      );
  
      await Class.update(
        {
          deleted_at: null,
          is_deleted: false,
        },
        {
          where: {
            id: schedule.classes[0].id,
            is_deleted: true,
            deleted_at: { [Op.ne]: null },
          },
          transaction,
        }
      );
  
      await ClassTeacher.update(
        {
          deleted_at: null,
          is_deleted: false,
        },
        {
          where: {
            class_id: schedule.classes[0].id,
            is_deleted: true,
            deleted_at: { [Op.ne]: null },
          },
          transaction,
        }
      );
  
      await Shift.update(
        {
          deleted_at: null,
          is_deleted: false,
        },
        {
          where: {
            id: schedule.classes[0].shifts[0].id,
            is_deleted: true,
            deleted_at: { [Op.ne]: null },
          },
          transaction,
        }
      );
  
      await Classroom.update(
        {
          deleted_at: null,
          is_deleted: false,
        },
        {
          where: {
            id: schedule.classes[0].classroom.id,
            is_deleted: true,
            deleted_at: { [Op.ne]: null },
          },
          transaction,
        }
      );
  
      await Course.update(
        {
          deleted_at: null,
          is_deleted: false,
        },
        {
          where: {
            id: schedule.classes[0].course.id,
            is_deleted: true,
            deleted_at: { [Op.ne]: null },
          },
          transaction,
        }
      );
  
      await transaction.commit();
      return { message: 'Restore completed successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  async forceDeleteTeacherScheduleById(class_id, date) {
    const transaction = await sequelize.transaction();
    try {
      const schedule = await this.getTeacherScheduleById(class_id, date);
  
      if (!schedule) {
        throw new Error('Schedule not found');
      }
  
      await ClassSchedule.destroy({
        where: {
          schedule_id: schedule.id,
          class_id: schedule.classes[0].id,
        },
        transaction,
      });
  
      await Class.destroy({
        where: {
          id: schedule.classes[0].id,
        },
        transaction,
      });
  
      await ClassTeacher.destroy({
        where: {
          class_id: schedule.classes[0].id,
        },
        transaction,
      });
  
      await Shift.destroy({
        where: {
          id: schedule.classes[0].shifts[0].id,
        },
        transaction,
      });
  
      await Classroom.destroy({
        where: {
          id: schedule.classes[0].classroom.id,
        },
        transaction,
      });
  
      await Course.destroy({
        where: {
          id: schedule.classes[0].course.id,
        },
        transaction,
      });
  
      await transaction.commit();
      return { message: 'Force delete completed successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
}

module.exports = new TeacherRepository();
