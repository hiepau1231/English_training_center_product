const sequelize = require('../../config/database');
const { Schedule, Shift, Class, Classroom, Teacher, Course } = require('../models');
const { Op } = require('sequelize');


class ScheduleRepository {

    async getAllSchedules(date) {
        
        try {
            return await Schedule.findAll({
                attributes: [
                    ['id', 'schedule_id'],
                    ['schedule_date', 'date'],
                    ['attendance', 'attendance'],
                    [sequelize.fn('COUNT', sequelize.col('class.id')), 'class_count']
                ],
                include: [
                    {
                        model: Shift,
                        as: 'shift',
                        attributes: ['id', 'teaching_shift'],
                    },
                    {
                        model: Class,
                        as: 'class',
                        attributes: ['id', 'class_name', 'course_id', 'cm_main', 'cm_sub'],
                        include: [
                            {
                                model: Course,
                                as: 'course',
                                attributes: ['id', 'course_name'],
                            },
                            {
                                model: Teacher,
                                as: 'MainTeacher',
                                attributes: ['id', 'teacher_name'],
                            },
                            {
                                model: Teacher,
                                as: 'SubTeacher',
                                attributes: ['id', 'teacher_name'],
                            }
                        ]
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        attributes: ['id', 'classroom_name', 'capacity'],
                    },
                ],
                where: {
                    schedule_date: date,
                    deleted_at: null
                },
                group: ['Schedule.id'],
            
            });
        } catch (error) {
            console.error("Error in ScheduleRepository:", error);
        }

    }
    
    async findScheduleById(id) {
        try {
            return await Schedule.findOne({
                attributes: [
                    ['id', 'schedule_id'],
                    ['schedule_date', 'date'],
                    ['attendance', 'attendance'],
                    // [sequelize.fn('COUNT', sequelize.col('class.id')), 'class_count']
                ],
                include: [
                    {
                        model: Shift,
                        as: 'shift',
                        attributes: ['id', 'teaching_shift'],
                    },
                    {
                        model: Class,
                        as: 'class',
                        attributes: ['id', 'class_name', 'course_id', 'cm_main', 'cm_sub'],
                        include: [
                            {
                                model: Course,
                                as: 'course',
                                attributes: ['id', 'course_name'],
                            },
                            {
                                model: Teacher,
                                as: 'MainTeacher',
                                attributes: ['id', 'teacher_name'],
                            },
                            {
                                model: Teacher,
                                as: 'SubTeacher',
                                attributes: ['id', 'teacher_name'],
                            }
                        ]
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        attributes: ['id', 'classroom_name', 'capacity'],
                    }
                ],
                where: {
                    id: id,
                    deleted_at: null
                },
                group: ['Schedule.id']
            });
        } catch (error) {
            
        }
    }
    async updateScheduleById(id, updatedData){
        const transaction = await sequelize.transaction();

    try {
        const [updatedScheduleRowsCount] = await Schedule.update({
            schedule_date: updatedData.date,
            attendance: updatedData.attendance
            },
            {
            where: {
                id: id,
                deleted_at: null
            },
            transaction
        });

        if (updatedData.shift) {
            await Shift.update({
                teaching_shift: updatedData.shift.teaching_shift,
            }, {
                where: {
                    id: updatedData.shift.id,
                },
                transaction
            });
        }
        if (updatedData.class && updatedData.class.course && updatedData.class.course.id) {
            await Course.update({
                course_name: updatedData.class.course.course_name,
            }, {
                where: {
                    id: updatedData.class.course.id,
                },
                transaction
            });
        }
        if (updatedData.class) {
            await Class.update({
                class_name: updatedData.class.class_name,
                course_id: updatedData.class.course_id,
                cm_main: updatedData.class.cm_main,
                cm_sub: updatedData.class.cm_sub,
            }, {
                where: {
                    id: updatedData.class.id,
                },
                transaction
            });
        }

        if (updatedData.MainTeacher) {
            await Teacher.update({teacher_name: updatedData.class.MainTeacher.teacher_name}, {
                where: {
                    id: updatedData.class.MainTeacher.id,
                },
                transaction
            });
        }

        if (updatedData.SubTeacher) {
            await Teacher.update({teacher_name: updatedData.class.SubTeacher.teacher_name},{
                where: {
                    id: updatedData.class.SubTeacher.id,
                },
                transaction
            });
        }

        if (updatedData.classroom) {
            await Classroom.update({
                classroom_name: updatedData.classroom.classroom_name,
                capacity: updatedData.classroom.capacity
            },  {
                where: {
                    id: updatedData.classroom.id,
                },
                transaction
            });
        }
        await transaction.commit();

        return await Schedule.findOne({
            attributes: [
                ['id', 'schedule_id'],
                ['schedule_date', 'date'],
                ['attendance', 'attendance'],
            ],
            include: [
                {
                    model: Shift,
                    as: 'shift',
                    attributes: ['id', 'teaching_shift'],
                },
                {
                    model: Class,
                    as: 'class',
                    attributes: ['id', 'class_name', 'course_id', 'cm_main', 'cm_sub'],
                    include: [
                        {
                            model: Course,
                            as: 'course',
                            attributes: ['id', 'course_name'],
                        },
                        {
                            model: Teacher,
                            as: 'MainTeacher',
                            attributes: ['id', 'teacher_name'],
                        },
                        {
                            model: Teacher,
                            as: 'SubTeacher',
                            attributes: ['id', 'teacher_name'],
                        }
                    ]
                },
                {
                    model: Classroom,
                    as: 'classroom',
                    attributes: ['id', 'classroom_name', 'capacity'],
                }
            ],
            where: {
                id: id,
                deleted_at: null
            },
            group: ['Schedule.id']
        });

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
    }
    async softDeleteScheduleById(id) {
        try {
            const result = await Schedule.update({ deleted_at: new Date(),  is_deleted: true }, { where: { id, is_deleted: false } });
            return result;
        } catch (error) {
            console.error("Error in softDeleteScheduleById:", error);
            throw error;
        }
    }
    async restoreScheduleById(id) {
        try {
            const result = await Schedule.update({ is_deleted: false, deleted_at: null }, { where: { id, is_deleted: true, deleted_at: { [Op.not]: null } } });
            return result;
        } catch (error) {
            console.error("Error in restore schedule repository:", error);
            throw error;
        }
    }
    async getAllScheduleDeleted() {
        try {
            const deletedSchedules = await Schedule.findAll({
                where: {
                    is_deleted: true,
                    deleted_at: {
                        [Op.not]: null,
                    }
                },
                include: [
                    {
                        model: Shift,
                        as: 'shift',
                        attributes: ['id', 'teaching_shift'],
                    },
                    {
                        model: Class,
                        as: 'class',
                        attributes: ['id', 'class_name', 'course_id', 'cm_main', 'cm_sub'],
                        include: [
                            {
                                model: Course,
                                as: 'course',
                                attributes: ['id', 'course_name'],
                            },
                            {
                                model: Teacher,
                                as: 'MainTeacher',
                                attributes: ['id', 'teacher_name'],
                            },
                            {
                                model: Teacher,
                                as: 'SubTeacher',
                                attributes: ['id', 'teacher_name'],
                            }
                        ]
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        attributes: ['id', 'classroom_name', 'capacity'],
                    }
                ],
                attributes: ['id', 'schedule_date', 'attendance']
            });
            return deletedSchedules;
        } catch (error) {
            console.error("Error in getAllScheduleDeleted:", error);
            throw error;
        }
    }
    async forceDeletedSchedule(id) {
        try {
            const result = await Schedule.destroy({
                where: {
                    id,
                    is_deleted: true,
                    deleted_at: {
                        [Op.not]: null,
                    }
                }
            });
            
            if (result === 0) {
                throw new Error('No schedule found to force delete');
            }
    
            return result;
        } catch (error) {
            console.error("Error in forceDeletedSchedule:", error);
            throw error;
        }
    }
    
    
}


module.exports = new ScheduleRepository;