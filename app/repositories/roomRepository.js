const sequelize = require('../../config/database');
const { Class, Schedule, Course, Classroom, Teacher, Shift } = require('../models/index');
const { Op } = require('sequelize');

class RoomRepository {
    async getRooms() {
        try {
            return await Classroom.findAll({
                attributes: ['id', 'classroom_name', 'capacity', 'type'],
                where: {deleted_at: null}
            })
        } catch (error) {
            console.error("Error in RoomRepository:", error);
            throw error;
        }
    }
    async getAllRooms(classroomName, scheduleDate) {
        try {
            return await Class.findAll({
                attributes: ['id', 'class_name', 'start_date', 'end_date'],
                include: [
                    {
                        model: Schedule,
                        as: 'schedules',
                        required: false,
                        where: { schedule_date: scheduleDate},
                        attributes: ['schedule_date'],
                        include: [
                            {
                                model: Shift,
                                as: 'shift',
                                attributes: ['teaching_shift'],
                            },
                        ],
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        required: false,
                        where: { classroom_name: classroomName },
                        attributes: ['classroom_name', 'capacity', 'type'],
                    },
                    {
                        model: Course,
                        as: 'course',
                        required: false,
                        attributes: ['course_name'],
                    },
                    {
                        model: Teacher,
                        as: 'MainTeacher',
                        required: false,
                        attributes: ['teacher_name'],
                    },
                ],
                where: { deleted_at: null,
                    '$classroom.classroom_name$': classroomName, // Điều kiện thêm để khớp với SQL thuần
                    '$schedules.schedule_date$': scheduleDate // Điều kiện thêm để khớp với SQL thuần
                 },
            });
        } catch (error) {
            console.error("Error in RoomRepository:", error);
            throw error;
        }
    }
    async findRoomById(id) {
        try {
            const room = await Class.findOne({
                where: {
                    id,
                    deleted_at: null
                },
                include: [
                    {
                        model: Schedule,
                        as: 'schedules',
                        required: false,
                        attributes: ['schedule_date'],
                        include: [
                            {
                                model: Shift,
                                as: 'shift',
                                attributes: ['teaching_shift'],
                            },
                        ],
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        required: false,
                        attributes: ['classroom_name', 'capacity', 'type'],
                    },
                    {
                        model: Course,
                        as: 'course',
                        required: false,
                        attributes: ['course_name'],
                    },
                    {
                        model: Teacher,
                        as: 'MainTeacher',
                        required: false,
                        attributes: ['teacher_name'],
                    },
                ],
                attributes:['id', 'class_name', 'start_date', 'end_date', 'updated_at', 'deleted_at']
            });
            return room;
        } catch (error) {
            console.error("Error in findById:", error);
            throw error;
        }
    }

    async updateRoomById(id, updateData) {
        console.log(updateData);
        
        try {
            const {
                class_name,
                start_date,
                end_date,
                schedules,
                classroom,
                course,
                MainTeacher
            } = updateData;
            
            const classInstance = await Class.findOne({
                where: {
                    id,
                    deleted_at: null 
                },
                include: [
                    {
                        model: Schedule,
                        as: 'schedules',
                        required: false,
                        include: [
                            {
                                model: Shift,
                                as: 'shift',
                                required: false
                            }
                        ]
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        required: false
                    },
                    {
                        model: Course,
                        as: 'course',
                        required: false
                    },
                    {
                        model: Teacher,
                        as: 'MainTeacher',
                        required: false
                    }
                ]
            });
    
            if (!classInstance) {
                throw new Error('Class not found');
            }
    
            await classInstance.update({
                class_name,
                start_date,
                end_date
            });
    
            if (schedules && schedules.length) {
                await Promise.all(schedules.map(async (scheduleData, index) => {
                    const schedule = classInstance.schedules[index];
    
                    if (schedule) {
                        await schedule.update({
                            schedule_date: scheduleData.schedule_date
                        });
    
                        if (scheduleData.shift) {
                            await schedule.shift.update({
                                teaching_shift: scheduleData.shift.teaching_shift
                            });
                        }
                    } else {
                        const newSchedule = await Schedule.create({
                            schedule_date: scheduleData.schedule_date,
                            classId: id 
                        });
    
                        if (scheduleData.shift) {
                            await Shift.create({
                                teaching_shift: scheduleData.shift.teaching_shift,
                                scheduleId: newSchedule.id
                            });
                        }
                    }
                }));
            }
    
            if (classInstance.classroom) {
                await classInstance.classroom.update({
                    classroom_name: classroom.classroom_name,
                    capacity: classroom.capacity,
                    type: classroom.type
                });
            }
    
            if (classInstance.course) {
                await classInstance.course.update({
                    course_name: course.course_name
                });
            }
    
            if (classInstance.MainTeacher) {
                await classInstance.MainTeacher.update({
                    teacher_name: MainTeacher.teacher_name
                });
            }
    
            return { message: 'Update successful' };
        } catch (error) {
            console.error("Error in updateById:", error);
            throw error;
        }
    }

    async softDeleteRoomById(id) {
        try {
           const result =  await Class.update({ deleted_at: new Date(),  is_deleted: true }, { where: { id, is_deleted: false } });
           return result
        } catch (error) {
            console.error("Error in softDeleteRoomById:", error);
            throw error;
        }
    }
    async getAllDeleted() {
        try {
            return await Class.findAll({
                where: {
                    is_deleted: true
                },
                include: [
                    {
                        model: Schedule,
                        as: 'schedules',
                        required: false,
                        attributes: ['schedule_date'],
                        include: [
                            {
                                model: Shift,
                                as: 'shift',
                                attributes: ['teaching_shift'],
                            },
                        ],
                    },
                    {
                        model: Classroom,
                        as: 'classroom',
                        required: false,
                        attributes: ['classroom_name', 'capacity', 'type'],
                    },
                    {
                        model: Course,
                        as: 'course',
                        required: false,
                        attributes: ['course_name'],
                    },
                    {
                        model: Teacher,
                        as: 'MainTeacher',
                        required: false,
                        attributes: ['teacher_name'],
                    },
                ],
                attributes:['id', 'class_name', 'start_date', 'end_date', 'updated_at', 'deleted_at', 'is_deleted']
            });
            
        } catch (error) {
            console.error("Error in getAllDeleted repository:", error);
            throw new Error('Failed to fetch deleted classes');
        }
    }
    async restoreRoomById(id) {
        try {
            const [affectedCount] = await Class.update({ is_deleted: false, deleted_at: null }, { where: { id, is_deleted: true } });
    
            if (affectedCount === 0) {
                throw new Error('No classroom found to restore');
            }
    
            return affectedCount;
        } catch (error) {
            console.error("Error in restoreClass repository:", error);
            throw new Error('Failed to restore class');
        }
    }
    
    async forceDeleteRoomById(id) {
        try {
            const classInstance = await Class.findOne({
                where: {
                    id,
                    is_deleted: true,
                    deleted_at: {
                        [Op.not]: null,
                    }
                },
                
            });
    
            if (!classInstance) {
                throw new Error('Class not found');
            }
    
            await classInstance.destroy({ force: true })
            return { message: 'Class deleted permanently' };
        } catch (error) {
            console.error("Error in forceDeleteClass repository:", error);
            throw new Error('Failed to permanently delete class');
        }
    }
}

module.exports = new RoomRepository();
