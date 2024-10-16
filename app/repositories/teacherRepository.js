const sequelize = require('../../config/database');
const { Class, Schedule, Course, Classroom, Teacher, Shift } = require('../models/index');
const { Op, Model } = require('sequelize');

class TeacherRepository {
    async getTeachers() {
        try {
            return await Teacher.findAll({
                attributes: ['id', 'teacher_name'],
                where: {deleted_at: null}
            })
        } catch (error) {
            console.error('Error fetching teacher schedules:', error);
            throw error;
        }
    }
    async getTeacherSchedules(schedule_date) {
        try {
            
            const startDate = new Date(schedule_date);
            const endDate = new Date(schedule_date);
            
            const findStartDate = startDate.setDate(startDate.getDate() - startDate.getDay());
            const findEndDate = endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

            const result = await Class.findAll({
                where: { deleted_at: null },
                attributes: ['id', 'class_name', 'start_date', 'end_date'],
                include: [
                    {
                        model: Schedule,
                        as: 'schedules',
                        required: true,
                        where: {
                            schedule_date: {
                                [Op.between]: [findStartDate, findEndDate]
                            },
                            deleted_at: null
                        },
                        attributes: [ 'id','attendance', 'schedule_date'],
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        required: true,
                        attributes: ['id','classroom_name', 'type', 'capacity'],
                    },
                    {
                        model: Course,
                        as: 'course',
                        required: true,
                        attributes: ['id','course_name', 'status', 'level'],
                    },
                    {
                        model: Teacher,
                        required: true,
                        attributes: ['id','teacher_name'],
                        as: 'MainTeacher',
                    },
                    {
                        model: Teacher,
                        required: true,
                        attributes: ['id','teacher_name'],
                        as: 'SubTeacher',
                    }
                ],
            });
            return result;
        } catch (error) {
            console.error('Error fetching teacher schedules:', error);
            throw error;
        }
    }
    async getTeacherScheduleById(id) {
        try {
            
            return await Class.findOne({
                where: {
                    id: id,
                    deleted_at: null
                },
                attributes: ['id', 'class_name', 'start_date', 'end_date'],
                include: [
                    {
                        model: Schedule,
                        as: 'schedules',
                        required: false,
                        where: {
                            deleted_at: null
                        },
                        attributes: ['id', 'attendance', 'schedule_date'],
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        attributes: ['id','classroom_name', 'type', 'capacity'],
                    },
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['id','course_name', 'status', 'level'],
                    },
                    {
                        model: Teacher,
                        attributes: ['id','teacher_name'],
                        as: 'MainTeacher',
                    },
                    {
                        model: Teacher,
                        attributes: ['id','teacher_name'],
                        as: 'SubTeacher',
                    }
                ],
            });
        } catch (error) {
            console.error('Error fetching teacher schedules:', error);
            throw error;
        }
    }
    async updateTeacherScheduleById(id, updateData) {

        const transaction = await sequelize.transaction();
    
        try {
            const [updatedClassRowsCount] = await Class.update({
                class_name: updateData.class_name,
                start_date: updateData.start_date,
                end_date: updateData.end_date,
                cm_main: updateData.MainTeacher.id,
                cm_sub: updateData.SubTeacher.id,
            }, {
                where: {
                    id: id,
                    deleted_at: null
                },
                transaction
            });
    
            if (Array.isArray(updateData.schedules)) {
                for (const schedule of updateData.schedules) {
                    const schedule_id = schedule.id;
                    
                    const [updatedScheduleRowsCount] = await Schedule.update({
                        schedule_date: schedule.schedule_date,
                        attendance: schedule.attendance,
                    }, {
                        where: {
                            id: 16,
                            deleted_at: null
                        },
                        transaction
                    });

                }
            }
            if (updateData.classroom) {
                await Classroom.update({
                    classroom_name: updateData.classroom.classroom_name,
                    type: updateData.classroom.type,
                    capacity: updateData.classroom.capacity
                }, {
                    where: {
                        id: updateData.classroom.id,
                    },
                    transaction
                });
            }
    
            if (updateData.course) {
                await Course.update({
                    course_name: updateData.course.course_name,
                    status: updateData.course.status,
                    level: updateData.course.level
                }, {
                    where: {
                        id: updateData.course.id,
                    },
                    transaction
                });
            }
    
            if (updateData.MainTeacher) {
                await Teacher.update({
                    teacher_name: updateData.MainTeacher.teacher_name
                }, {
                    where: {
                        id: updateData.MainTeacher.id,
                        deleted_at: null
                    },
                    transaction
                });
            }
    
            if (updateData.SubTeacher) {
                await Teacher.update({
                    teacher_name: updateData.SubTeacher.teacher_name
                }, {
                    where: {
                        id: updateData.SubTeacher.id,
                        deleted_at: null
                    },
                    transaction
                });
            }
    
            await transaction.commit();
    
            return await Class.findOne({
                where: {
                    id: id,
                    deleted_at: null
                },
                attributes: ['id', 'class_name', 'start_date', 'end_date'],
                include: [
                    {
                        model: Schedule,
                        as: 'schedules',
                        required: false,
                        where: {
                            deleted_at: null
                        },
                        attributes: ['id', 'attendance', 'schedule_date'],
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        attributes: ['id','classroom_name', 'type', 'capacity'],
                    },
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['id','course_name', 'status', 'level'],
                    },
                    {
                        model: Teacher,
                        attributes: ['id','teacher_name'],
                        as: 'MainTeacher',
                    },
                    {
                        model: Teacher,
                        attributes: ['id','teacher_name'],
                        as: 'SubTeacher',
                    }
                ],
            });
    
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async softDeleteTeacherScheduleById(id) {
        try {
            const result = await Class.update({ deleted_at: new Date(),  is_deleted: true }, { where: { id, is_deleted: false } });
            return result;
        } catch (error) {
            console.error('Error fetching teacher schedules:', error);
            throw error;
        }
    }

    async getDeletedTeacherScheduleAll() {
        try {
            const result = await Class.findAll({
                where: { is_deleted: true, deleted_at: { [Op.ne]: null}  },
                attributes: ['id', 'class_name', 'start_date', 'end_date'],
                include: [
                    {
                        model: Schedule,
                        as: 'schedules',
                        required: false,
                        attributes: [ 'id','attendance', 'schedule_date'],
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        attributes: ['id','classroom_name', 'type', 'capacity'],
                    },
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['id','course_name', 'status', 'level'],
                    },
                    {
                        model: Teacher,
                        attributes: ['id','teacher_name'],
                        as: 'MainTeacher',
                    },
                    {
                        model: Teacher,
                        attributes: ['id','teacher_name'],
                        as: 'SubTeacher',
                    }
                ],
            });
    
            return result;
        } catch (error) {
            console.error('Error retrieving deleted teacher schedules:', error);
            throw error;
        }
    }
    async restoreTeacherScheduleById(id) {
        try {
            const result = await Class.update({ is_deleted: false, deleted_at: null }, { where: { id, is_deleted: true, deleted_at: { [Op.not]: null } } });
            return result;
        } catch (error) {
            console.error('Error restoring teacher schedule by id:', error);
            throw error; 
        }
    }
        async forceDeleteTeacherScheduleById(id) {
        try {
            const result = await Class.destroy({
                where: {
                    id,
                    is_deleted: true,
                    deleted_at: {
                        [Op.not]: null,
                    }
                }
            });
            
            if (result === 0) {
                throw new Error('No teacher schedule found to force delete');
            }
    
            return result;
        } catch (error) {
            console.error("Error in forceTeacherchedule:", error);
            throw error;
        }
    }
}

module.exports = new TeacherRepository();