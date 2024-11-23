const sequelize = require('../../config/database');
const {
  Class,
  Schedule,
  Course,
  Classroom,
  Teacher,
  Shift,
  Level,
  ClassSchedule,
  ClassTeacher,
  TeacherLevel,
  ScheduleShift
} = require('../models/index');
const { Op } = require('sequelize');

class RoomRepository {
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
        teacher_name: teacher.teacher_name,
        id: teacher.id,
      }));
    } catch (error) {
      console.error('Error fetching teachers with the same level:', error);
      throw error;
    }
  }
  async getShifts(date, teaching_shift) {
    try {
      const shift = await Schedule.findAll({
        attributes: ['id','schedule_date'],
        include: [
          {
              model: Shift,
              as: 'schedule_shift',
              attributes: ['id','teaching_shift'],
              where: {
              teaching_shift : {
                [Op.ne]: teaching_shift
              },
            },
          },
        ],
        where: {
          schedule_date: date,
        },
      });
      return shift;
    } catch (error) {
      console.error('Error in RoomRepository with method getShift:', error);
    }

  }
  async getClassrooms(schedule_date =  null, classroom_name = null) {
    try {
      const whereClause = { deleted_at: null };
  
      return await Class.findAll({
        where: whereClause,
        attributes: ['id', 'class_name'],
        include: [
          {
            model: Classroom,
            as: 'classroom',
            attributes: ['id', 'classroom_name', 'capacity', 'type'],
            required: !! classroom_name,
            where: classroom_name ? { classroom_name: classroom_name } : undefined
          },
          {
            model: Teacher,
            as: 'Teachers',
            attributes: ['id', 'teacher_name'],
            through: { model: ClassTeacher, attributes: ['role'] },
            include: [
              {
                model: Level,
                as: 'levels',
                attributes: ['id', 'level_name'],
                through: { model: TeacherLevel, attributes: ['level_id'] },
              },
            ],
          },
          {
            model: Schedule,
            as: 'schedules',
            attributes: ['id', 'schedule_date'],
            required: !! schedule_date,
            where: schedule_date ?{schedule_date: schedule_date}: undefined ,
            through: {
              model: ClassSchedule,
              attributes: ['id', 'schedule_id'],
            },
          },
          {
            model: Shift,
            as: 'shifts',
            attributes: ['id', 'teaching_shift'],
            required: true,
          },
        ],
      });

    } catch (error) {
      console.error('Error in RoomRepository with method getClassrooms:', error);
      throw error;
    }
  }
  async getAvailableClassrooms(date, currentClassroomId) {
    try {
      // Tìm tất cả các phòng học có lịch trong ngày được cung cấp (trừ phòng hiện tại)
      const scheduledClassrooms = await Classroom.findAll({
        attributes: ['id', 'classroom_name'],
        include: [
          {
            model: Schedule,
            as: 'schedules',
            attributes: [],
            where: {
              schedule_date: date, // Lấy lịch theo ngày
            },
          },
        ],
        where: {
          id: {
            [Op.ne]: currentClassroomId, // Tránh trùng phòng học hiện tại
          },
        },
      });
  
      // Lấy danh sách các ID phòng học đã được lên lịch
      const scheduledClassroomIds = scheduledClassrooms.map((room) => room.id);
  
      // Lấy danh sách các phòng học không có lịch hoặc không nằm trong danh sách trên
      const availableClassrooms = await Classroom.findAll({
        attributes: ['id', 'classroom_name', 'capacity', 'type', 'status'],
        where: {
          id: {
            [Op.notIn]: scheduledClassroomIds, // Phòng không nằm trong danh sách đã được lên lịch
          },
          deleted_at: null, // Loại trừ các phòng bị xoá
        },
      });
  
      return availableClassrooms.map((room) => ({
        id: room.id,
        name: room.classroom_name,
        capacity: room.capacity,
        type: room.type,
        status: room.status,
      }));
    } catch (error) {
      console.error('Error in RoomRepository with method getAvailableClassrooms:', error);
      throw error;
    }
  }
  
  async getClassroomName() {
    try {
      return await Classroom.findAll({
        attributes: ['id', 'classroom_name'],
        where: {
          deleted_at: null,
        },
      });
    } catch (error) {
      console.error('Error in RoomRepository with method getClassroomName:', error);
      throw error;
    }
  }
 
  async findClassroomById(classroom_id, date) {
    try {
      const room = await Class.findOne({
        where: { deleted_at: null },
        attributes: ['id', 'class_name'],
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'course_name'],
          },
          {
            model: Classroom,
            as: 'classroom',
            attributes: ['id', 'classroom_name', 'capacity', 'type', 'status'],
            where: { id: classroom_id },
          },
          {
            model: Teacher,
            as: 'Teachers',
            attributes: ['id', 'teacher_name'],
            through: { model: ClassTeacher, attributes: ['role'] },
            include: [
              {
                model: Level,
                as: 'levels',
                attributes: ['id', 'level_name'],
                through: { model: TeacherLevel, attributes: ['level_id'] },
              },
            ],
          },
          {
            model: Schedule,
            as: 'schedules',
            attributes: ['id', 'schedule_date'],
            where: { schedule_date: date },
            through: {
              model: ClassSchedule,
              attributes: ['id', 'schedule_id'],
            },
          },
          {
            model: Shift,
            as: 'shifts',
            attributes: ['id', 'teaching_shift'],
            required: true,
          },
        ],
      });
  
      if (!room) {
        throw new Error('Classroom not found');
      }
      const currentTeacher = room.Teachers[0]?.teacher_name;
      const sameLevelTeachers = await this.getTeachers(currentTeacher);

      const currentShift = room.shifts[0]?.teaching_shift;
      const Shifts = await this.getShifts(date, currentShift);

      const Classrooms = await this.getAvailableClassrooms(date, classroom_id);
  
      return {
        room,
       Shifts,
        sameLevelTeachers,
       Classrooms,
      };
    } catch (error) {
      console.error('Error in RoomRepository with method findClassroomById:', error);
      throw error;
    }
  }
  async findClassroom(classroom_id, date) {
    try {
      return await Class.findOne({
        where: { deleted_at: null },
        attributes: ['id', 'class_name'],
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'course_name'],
          },
          {
            model: Classroom,
            as: 'classroom',
            attributes: ['id', 'classroom_name', 'capacity', 'type', 'status'],
            where: { id: classroom_id },
          },
          {
            model: Teacher,
            as: 'Teachers',
            attributes: ['id', 'teacher_name'],
            through: { model: ClassTeacher, attributes: ['role'] },
            include: [
              {
                model: Level,
                as: 'levels',
                attributes: ['id', 'level_name'],
                through: { model: TeacherLevel, attributes: ['level_id'] },
              },
            ],
          },
          {
            model: Schedule,
            as: 'schedules',
            attributes: ['id', 'schedule_date'],
            where: { schedule_date: date },
            through: {
              model: ClassSchedule,
              attributes: ['id', 'schedule_id'],
            },
          },
          {
            model: Shift,
            as: 'shifts',
            attributes: ['id', 'teaching_shift'],
            required: true,
          },
        ],
      });
    } catch (error) {
      console.error('Error in RoomRepository with method findClassroomById:', error);
      throw error;
    }
  }
  async updateClassroomById(classroom_id, date, updateData) {
    console.log(updateData);
    
    const transaction = await sequelize.transaction();

    try {
        const roomData = await this.findClassroom(classroom_id, date);
        if (!roomData) {
            throw new Error('Classroom not found');
        }

        await Classroom.update(
            {
                classroom_name: updateData.classroomName,
                capacity: updateData.capacity,
                type: updateData.roomType,
                status: updateData.status,
            },
            {
                where: { id: classroom_id },
                transaction,
            }
        );

        const updatedClass = await Class.update(
            {
                class_name: updateData.className,
                course_name: updateData.courseName,
            },
            {
                where: { id : roomData.id, deleted_at: null },
                transaction,
            }
        );

        if (updatedClass[0] === 0) {
            throw new Error('Class update failed');
        }

        for (const teacher of updateData.teacherRole) {

            await ClassTeacher.update(
                {
                    role: teacher.ClassTeacher.role,
                },
                {
                    where: {
                        class_id: roomData.id,
                        teacher_id:teacher.ClassTeacher.id,
                    },
                    transaction,
                }
            );
            await Teacher.update(
                {
                    teacher_name: teacher.teacher_name,
                },
                {
                    where: { id: teacher.ClassTeacher.id },
                    transaction,
                }
            );
        }
        for (const shift of updateData.teachingShift) {
            await Shift.update(
                {
                    teaching_shift: shift.teaching_shift,
                },
                {
                    where: { id: shift.id },
                    transaction,
                }
            );
        }

        await Schedule.update(
            {
                schedule_date: updateData.scheduleDate,
            },
            {
                where: { classroom_id, schedule_date: date },
                transaction,
            }
        );
        
        await transaction.commit();

       
        const updatedRoom = await this.findClassroom(classroom_id, date);

        return updatedRoom;
    } catch (error) {
        
        await transaction.rollback();
        console.error('Error in updateClassroomById:', error);
        throw error;
    }
}

  async softDeleteClassroomById(classroom_id, date) {
    const transaction = await sequelize.transaction();
    try {
      const classroom = await this.findClassroom(classroom_id, date);
  
      if (!classroom) {
        throw new Error('Classroom or related records not found');
      }
  
      const currentTime = new Date();
  
      await classroom.update(
        { is_deleted: true, deleted_at: currentTime },
        { transaction }
      );
  
      if (classroom.course) {
        await classroom.course.update(
          { is_deleted: true, deleted_at: currentTime },
          { transaction }
        );
      }
  
      if (classroom.classroom) {
        await classroom.classroom.update(
          { is_deleted: true, deleted_at: currentTime },
          { transaction }
        );
      }
  
      for (const teacher of classroom.Teachers || []) {
        await teacher.update(
          { is_deleted: true, deleted_at: currentTime },
          { transaction }
        );
  
        for (const level of teacher.levels || []) {
          await level.update(
            { is_deleted: true, deleted_at: currentTime },
            { transaction }
          );
        }
      }
  
      for (const schedule of classroom.schedules || []) {
        await schedule.update(
          { is_deleted: true, deleted_at: currentTime },
          { transaction }
        );
  
        await ClassSchedule.update(
          { is_deleted: true, deleted_at: currentTime },
          { where: { id: schedule.ClassSchedule.id }, transaction }
        );
      }
  
      for (const shift of classroom.shifts || []) {
        await shift.update(
          { is_deleted: true, deleted_at: currentTime },
          { transaction }
        );
      }
  
      await transaction.commit();
      return { message: 'Soft delete completed successfully' };
    } catch (error) {
      await transaction.rollback();
      console.error('Error in RoomRepository with method softDeleteClassroom:', error);
      throw error;
    }
  }
  async getAllDeletedClassroom() {
    try {
      const classrooms = await Class.findAll({
        where: {
          is_deleted: true,
        },
        attributes: ['id', 'class_name'],
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'course_name'],
          },
          {
            model: Classroom,
            as: 'classroom',
            attributes: ['id', 'classroom_name', 'capacity', 'type', 'status'],
          },
          {
            model: Teacher,
            as: 'Teachers',
            attributes: ['id', 'teacher_name'],
            through: { model: ClassTeacher, attributes: ['role'] },
            include: [
              {
                model: Level,
                as: 'levels',
                attributes: ['id', 'level_name'],
                through: { model: TeacherLevel, attributes: ['level_id'] },
              },
            ],
          },
          {
            model: Schedule,
            as: 'schedules',
            attributes: ['id', 'schedule_date'],
            through: {
              model: ClassSchedule,
              attributes: ['id', 'schedule_id'],
            },
          },
          {
            model: Shift,
            as: 'shifts',
            attributes: ['id', 'teaching_shift'],
            required: true,
          },
        ],
      });
      return classrooms.length !== 0 ? classrooms : { message: 'No soft delete Classrooms ' } ;
    } catch (error) {
      console.error('Error in roomRepository with method getAllDeletedClassroom:', error);
      throw new Error('Failed to fetch deleted classes');
    }
  }
  
  async restoreClassroomById(classroom_id, date) {
    try {
      const deletedClassroom = await Class.findOne({
        where: {
          is_deleted: true,
        },
        attributes: ['id', 'class_name'],
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'course_name'],
          },
          {
            model: Classroom,
            as: 'classroom',
            attributes: ['id', 'classroom_name', 'capacity', 'type', 'status'],
          },
          {
            model: Teacher,
            as: 'Teachers',
            attributes: ['id', 'teacher_name'],
            through: { model: ClassTeacher, attributes: ['role'] },
            include: [
              {
                model: Level,
                as: 'levels',
                attributes: ['id', 'level_name'],
                through: { model: TeacherLevel, attributes: ['level_id'] },
              },
            ],
          },
          {
            model: Schedule,
            as: 'schedules',
            attributes: ['id', 'schedule_date'],
            through: {
              model: ClassSchedule,
              attributes: ['id', 'schedule_id'],
            },
          },
          {
            model: Shift,
            as: 'shifts',
            attributes: ['id', 'teaching_shift'],
            required: true,
          },
        ],
      });
  
      if (!deletedClassroom) {
        throw new Error(`Classroom with ID ${classroom_id} and date ${date} is not found or not deleted.`);
      }
  
      // Khôi phục lớp học
      await deletedClassroom.update({
        is_deleted: false, // Đặt lại trạng thái không xóa
        deleted_at: null, // Xóa thời gian xóa mềm
      });
  
      // Khôi phục liên kết nếu cần
      if (deletedClassroom.schedules) {
        for (const schedule of deletedClassroom.schedules) {
          await schedule.update({
            is_deleted: false,
            deleted_at: null,
          });
        }
      }
  
      return deletedClassroom;
    } catch (error) {
      console.error('Error in roomRepository with method restoreClassroomById :', error);
      throw new Error('Failed to restore class');
    }
  }

  async forceDeleteClassroomById(classroom_id, date) {
    const transaction = await sequelize.transaction();
  try {
    const classroom = await this.findClassroom(classroom_id, date);

    if (!classroom) {
      throw new Error('Classroom not found');
    }

    await classroom.destroy({ transaction });

    if (classroom.course) {
      await classroom.course.destroy({ transaction });
    }

    if (classroom.classroom) {
      await classroom.classroom.destroy({ transaction });
    }

    for (const teacher of classroom.Teachers || []) {
      await teacher.destroy({ transaction });

      for (const level of teacher.levels || []) {
        await level.destroy({ transaction });
      }
    }

    for (const schedule of classroom.schedules || []) {
      await schedule.destroy({ transaction });
    }

    for (const shift of classroom.shifts || []) {
      await shift.destroy({ transaction });
    }

    await transaction.commit();

    return { message: 'Force delete completed successfully' };
    } catch (error) {
      console.error('Error in roomRepository with method forceDeleteClassroomById:', error);
      throw new Error('Failed to permanently delete class');
    }
  }
}

module.exports = new RoomRepository();
