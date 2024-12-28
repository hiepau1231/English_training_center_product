import { IClassScheduleService } from "../interfaces/IClassScheduleService";
import { ClassSchedule } from "../entities/ClassSchedule";
import { Teacher } from "../entities/Teacher";
import { Room } from "../entities/Room";
import { ClassScheduleRepository } from "../repositories/ClassScheduleRepository";
import { TeacherRepository } from "../repositories/TeacherRepository";
import { RoomRepository } from "../repositories/RoomRepository";
import { AppError } from "../utils/AppError";
import { Class } from "../entities/Class";
import { Shift } from "../entities/Shift";
import { AppDataSource } from '../data-source';
import { Between, IsNull, UpdateResult } from 'typeorm';

interface ClassTypeStats {
    totalClasses: number;
    averageSessionsPerClass: number;
    completedClasses: number;
}

interface Statistics {
    byClassType: {
        regular: ClassTypeStats;
        tutorial: ClassTypeStats;
        minispeaking: ClassTypeStats;
    };
    byTeacher: Record<number, number>;
    byClassroom: Record<number, number>;
}

interface ResolvedConflict {
    originalSchedule: {
        classId: number;
        className: string;
        roomId: number;
        scheduleDate: Date;
        shiftId: number;
    };
    newSchedule: {
        classId: number;
        className: string;
        roomId: number;
        scheduleDate: Date;
        shiftId: number;
    };
}

interface ConflictResolution {
    resolved: ResolvedConflict[];
    remainingConflicts: number;
}

type ClassType = 'regular' | 'tutorial' | 'minispeaking';

interface RoomReference {
    id: number;
}

interface ScheduleConflict {
    scheduleDate: Date;
    shift: Shift;
    room: Room | RoomReference;
    classes: Class[];
}

interface ConflictResolutionParams {
    alternativeRoomId?: number;
    alternativeShiftId?: number;
    forceResolve?: boolean;
}

interface ConflictResolutionResult {
    totalResolved: number;
    resolved: ResolvedConflict[];
    remainingConflicts: number;
}

export class ClassScheduleService implements IClassScheduleService {
    constructor(
        private classScheduleRepo: ClassScheduleRepository,
        private teacherRepo: TeacherRepository,
        private roomRepo: RoomRepository
    ) {}

    async getAllSchedules(): Promise<{ total: number; schedules: ClassSchedule[] }> {
        const schedules = await this.classScheduleRepo.find({
            relations: ['class', 'room', 'teacher', 'shift'],
            order: { scheduleDate: 'ASC' }
        });
        return {
            total: schedules.length,
            schedules
        };
    }

    async getDailySchedules(date: Date): Promise<{ totalClasses: number; schedules: ClassSchedule[] }> {
        try {
            const schedules = await this.classScheduleRepo.find({
                where: {
                    scheduleDate: date,
                    deletedAt: IsNull()
                },
                relations: [
                    'class',
                    'class.course',
                    'room',
                    'teacher',
                    'teacher.level',
                    'shift'
                ],
                order: {
                    shift: {
                        startTime: 'ASC'
                    }
                }
            });

            return {
                totalClasses: schedules.length,
                schedules
            };
        } catch (error) {
            console.error('Error in getDailySchedules service:', error);
            throw new AppError(
                'Failed to fetch daily schedules',
                500
            );
        }
    }

    async getScheduleDetails(scheduleId: number): Promise<ClassSchedule> {
        try {
            const schedule = await this.classScheduleRepo.findOne({
                where: {
                    id: scheduleId,
                    deletedAt: IsNull()
                },
                relations: [
                    'class',
                    'class.course',
                    'room',
                    'teacher',
                    'teacher.level',
                    'shift'
                ]
            });

            if (!schedule) {
                throw new AppError('Schedule not found', 404);
            }

            return schedule;
        } catch (error) {
            console.error('Error in getScheduleDetails service:', error);
            throw new AppError(
                'Failed to fetch schedule details',
                500
            );
        }
    }

    async replaceTeacher(scheduleId: number, newTeacherId: number): Promise<ClassSchedule> {
        const schedule = await this.getScheduleDetails(scheduleId);
        
        if (!schedule.teacher) {
            throw new AppError("Current teacher not found", 404);
        }
        
        if (!schedule.teacher.level) {
            throw new AppError("Current teacher level information not found", 404);
        }

        const newTeacher = await this.teacherRepo.findOne({
            where: { id: newTeacherId },
            relations: { level: true }
        });

        if (!newTeacher) {
            throw new AppError("New teacher not found", 404);
        }

        if (!newTeacher.level) {
            throw new AppError("New teacher level information missing", 404);
        }

        if (schedule.teacher.level.id !== newTeacher.level.id) {
            throw new AppError("New teacher must have the same level as current teacher", 400);
        }

        if (!schedule.shift) {
            throw new AppError("Schedule shift information not found", 404);
        }

        const hasConflict = await this.checkTeacherAvailability(
            newTeacherId,
            schedule.scheduleDate,
            schedule.shift.startTime,
            schedule.shift.endTime,
            scheduleId
        );

        if (hasConflict) {
            throw new AppError("New teacher is not available at this time", 400);
        }

        await this.teacherRepo.update(schedule.teacher.id, { isDeleted: false });
        await this.teacherRepo.update(newTeacherId, { isDeleted: true });

        const updatedSchedule = await this.classScheduleRepo.updateTeacher(scheduleId, newTeacherId);
        if (!updatedSchedule) {
            throw new AppError("Failed to update schedule", 500);
        }
        return updatedSchedule;
    }

    async replaceRoom(scheduleId: number, newRoomId: number): Promise<ClassSchedule> {
        const schedule = await this.getScheduleDetails(scheduleId);

        if (!schedule.room) {
            throw new AppError("Current room information not found", 404);
        }

        const newRoom = await this.roomRepo.findOne({
            where: { id: newRoomId }
        });

        if (!newRoom) {
            throw new AppError("New room not found", 404);
        }

        if (!schedule.shift) {
            throw new AppError("Schedule shift information not found", 404);
        }

        const hasConflict = await this.classScheduleRepo.checkTimeConflict(
            newRoomId,
            schedule.scheduleDate,
            schedule.shift.startTime,
            schedule.shift.endTime,
            scheduleId
        );

        if (hasConflict) {
            throw new AppError("Room is not available at this time", 400);
        }

        await this.roomRepo.update(schedule.room.id, { status: false });
        await this.roomRepo.update(newRoomId, { status: true });

        const updatedSchedule = await this.classScheduleRepo.updateRoom(scheduleId, newRoomId);
        if (!updatedSchedule) {
            throw new AppError("Failed to update schedule", 500);
        }
        return updatedSchedule;
    }

    async rescheduleClass(
        scheduleId: number,
        startTime: string,
        endTime: string
    ): Promise<ClassSchedule> {
        const schedule = await this.getScheduleDetails(scheduleId);

        if (!schedule.shift) {
            throw new AppError("Schedule shift information not found", 404);
        }

        // Check for room conflicts
        const hasRoomConflict = await this.classScheduleRepo.checkTimeConflict(
            schedule.roomId,
            schedule.scheduleDate,
            startTime,
            endTime,
            scheduleId
        );

        if (hasRoomConflict) {
            throw new AppError("Room is not available at new time", 400);
        }

        // Check for teacher conflicts
        const hasTeacherConflict = await this.checkTeacherAvailability(
            schedule.teacherId,
            schedule.scheduleDate,
            startTime,
            endTime,
            scheduleId
        );

        if (hasTeacherConflict) {
            throw new AppError("Teacher is not available at new time", 400);
        }

        try {
            // Update shift times
            await AppDataSource.getRepository('shifts').update(
                schedule.shift.id,
                {
                    startTime: `${startTime}:00`,
                    endTime: `${endTime}:00`,
                    teachingShift: `${startTime} - ${endTime}`,
                    updatedAt: new Date()
                }
            );

            // Update schedule time field
            await this.classScheduleRepo.update(
                scheduleId,
                {
                    time: `${startTime} - ${endTime}`,
                    updatedAt: new Date()
                }
            );

            // Fetch and return updated schedule
            const updatedSchedule = await this.getScheduleDetails(scheduleId);
            return updatedSchedule;
        } catch (error) {
            console.error('Error updating schedule times:', error);
            throw new AppError("Failed to update schedule times", 500);
        }
    }

    async findAvailableReplacementTeachers(
        scheduleId: number,
        scheduleDate: Date,
        startTime: string,
        endTime: string
    ): Promise<Teacher[]> {
        const schedule = await this.getScheduleDetails(scheduleId);

        if (!schedule.teacher?.level?.id) {
            throw new AppError("Current teacher level information not found", 404);
        }

        const currentTeacherLevel = schedule.teacher.level.id;

        // Get all teachers of same level
        const teachers = await this.teacherRepo.findTeachersByLevelAndStatus(
            currentTeacherLevel,
            false // not deleted
        );

        if (!teachers || teachers.length === 0) {
            return [];
        }

        // Filter out teachers with conflicts
        const availableTeachers = [];
        for (const teacher of teachers) {
            const hasConflict = await this.checkTeacherAvailability(
                teacher.id,
                scheduleDate,
                startTime,
                endTime
            );
            if (!hasConflict) {
                availableTeachers.push(teacher);
            }
        }

        return availableTeachers;
    }

    async findAvailableReplacementRooms(
        date: Date,
        startTime: string,
        endTime: string,
        minCapacity: number = 0
    ): Promise<Room[]> {
        try {
            const rooms = await this.classScheduleRepo.findAvailableRooms(
                date,
                startTime,
                endTime,
                minCapacity
            );
            return rooms;
        } catch (error) {
            throw new AppError('Error finding available rooms', 500);
        }
    }

    private async checkTeacherAvailability(
        teacherId: number,
        date: Date,
        startTime: string,
        endTime: string,
        excludeScheduleId?: number
    ): Promise<boolean> {
        const schedules = await this.classScheduleRepo.findTeacherSchedules(
            teacherId,
            date,
            startTime,
            endTime,
            excludeScheduleId
        );
        return schedules.length > 0;
    }

    private async generateSchedulesForClass(cls: Class, shifts: Shift[] = []): Promise<ClassSchedule[]> {
        const schedules: ClassSchedule[] = [];
        const totalWeeks = Math.ceil(
            (cls.endDate.getTime() - cls.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
        );
        const requiredSchedules = totalWeeks * 2; // 2 buổi/tuần

        let currentDate = new Date(cls.startDate);
        const usedTimeSlots = new Map<string, number[]>();

        while (currentDate <= cls.endDate && schedules.length < requiredSchedules) {
            const dateKey = currentDate.toISOString().split('T')[0];
            const usedShifts = usedTimeSlots.get(dateKey) || [];

            // Lọc ca học còn trống
            const availableShifts = shifts.filter(shift => !usedShifts.includes(shift.id));

            if (availableShifts.length > 0) {
                // Tạo lịch học cho ca đầu tiên
                const schedule = new ClassSchedule();
                schedule.scheduleDate = new Date(currentDate);
                schedule.classId = cls.id;
                schedule.shiftId = availableShifts[0].id;
                schedule.courseId = cls.course?.id || 0;
                schedule.roomId = cls.classroom?.id || 0;
                if (cls.classTeachers && cls.classTeachers.length > 0) {
                    schedule.teacherId = cls.classTeachers[0].teacherId;
                }
                schedules.push(schedule);

                // Cập nhật ca học đã sử dụng
                if (!usedTimeSlots.has(dateKey)) {
                    usedTimeSlots.set(dateKey, []);
                }
                usedTimeSlots.get(dateKey)?.push(availableShifts[0].id);

                // Nếu còn ca trống và cần thêm lịch học, tạo thêm một buổi nữa
                if (schedules.length < requiredSchedules && availableShifts.length > 1) {
                    const secondSchedule = new ClassSchedule();
                    secondSchedule.scheduleDate = new Date(currentDate);
                    secondSchedule.classId = cls.id;
                    secondSchedule.shiftId = availableShifts[1].id;
                    secondSchedule.courseId = cls.course?.id || 0;
                    secondSchedule.roomId = cls.classroom?.id || 0;
                    if (cls.classTeachers && cls.classTeachers.length > 0) {
                        secondSchedule.teacherId = cls.classTeachers[0].teacherId;
                    }
                    schedules.push(secondSchedule);
                    usedTimeSlots.get(dateKey)?.push(availableShifts[1].id);
                }
            }

            // Tăng ngày lên 7 ngày
            currentDate.setDate(currentDate.getDate() + 7);
        }

        return schedules;
    }

    async findScheduleConflicts(): Promise<ScheduleConflict[]> {
        const schedules = await this.classScheduleRepo.find({
            relations: ['class', 'room', 'shift', 'teacher'],
            where: {
                scheduleDate: Between(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)))
            }
        });

        const conflicts: ScheduleConflict[] = [];
        const scheduleMap = new Map<string, ClassSchedule[]>();

        // Group schedules by date, shift and room
        for (const schedule of schedules) {
            if (!schedule.scheduleDate || !schedule.shift || !schedule.room) continue;
            
            const roomId = typeof schedule.room === 'object' && schedule.room !== null ? (schedule.room as Room | RoomReference).id : 0;
            const key = `${schedule.scheduleDate.toISOString()}_${schedule.shift.id}_${roomId}`;
            
            if (!scheduleMap.has(key)) {
                scheduleMap.set(key, []);
            }
            scheduleMap.get(key)?.push(schedule);
        }

        // Find conflicts
        for (const [key, roomSchedules] of scheduleMap.entries()) {
            if (roomSchedules.length > 1) {
                const [date, shiftId, roomId] = key.split('_');
                const shift = roomSchedules[0].shift;
                const room = roomSchedules[0].room;
                const classes = roomSchedules.map(s => s.class).filter((c): c is Class => c !== null);

                if (shift && room) {
                    conflicts.push({
                        scheduleDate: new Date(date),
                        shift,
                        room: typeof room === 'string' ? { id: parseInt(room, 10) } : room,
                        classes
                    });
                }
            }
        }

        return conflicts;
    }

    async resolveScheduleConflicts(conflicts: ScheduleConflict[]): Promise<ConflictResolution> {
        const resolved: ResolvedConflict[] = [];
        let remainingConflicts = conflicts.length;

        for (const conflict of conflicts) {
            if (!conflict.shift || !conflict.room || conflict.classes.length === 0) {
                continue;
            }

            // Tìm phòng thay thế phù hợp
            const alternativeRooms = await this.findAvailableReplacementRooms(
                conflict.scheduleDate,
                conflict.shift.startTime,
                conflict.shift.endTime,
                conflict.classes[0].numberOfStudents
            );

            if (alternativeRooms.length > 0) {
                // Tìm lịch học hiện tại
                const schedule = await this.classScheduleRepo.findOne({
                    where: {
                        classId: conflict.classes[0].id,
                        scheduleDate: conflict.scheduleDate
                    }
                });

                if (schedule) {
                    // Lưu thông tin lịch học cũ
                    const originalSchedule = {
                        classId: conflict.classes[0].id,
                        className: conflict.classes[0].className,
                        roomId: conflict.room.id,
                        scheduleDate: conflict.scheduleDate,
                        shiftId: conflict.shift.id
                    };

                    // Thay đổi phòng học
                    await this.replaceRoom(schedule.id, alternativeRooms[0].id);

                    // Lưu thông tin lịch học mới
                    const newSchedule = {
                        classId: conflict.classes[0].id,
                        className: conflict.classes[0].className,
                        roomId: alternativeRooms[0].id,
                        scheduleDate: conflict.scheduleDate,
                        shiftId: conflict.shift.id
                    };

                    // Thêm vào danh sách đã giải quyết
                    resolved.push({
                        originalSchedule,
                        newSchedule
                    });

                    // Giảm số lượng conflict chưa giải quyết
                    remainingConflicts--;
                }
            }
        }

        return {
            resolved,
            remainingConflicts
        };
    }

    async getScheduleStatistics(): Promise<Statistics> {
        const schedules = await this.classScheduleRepo.find({
            relations: ['class', 'room', 'teacher']
        });

        const stats: Statistics = {
            byClassType: {
                regular: {
                    totalClasses: 0,
                    averageSessionsPerClass: 0,
                    completedClasses: 0
                },
                tutorial: {
                    totalClasses: 0,
                    averageSessionsPerClass: 0,
                    completedClasses: 0
                },
                minispeaking: {
                    totalClasses: 0,
                    averageSessionsPerClass: 0,
                    completedClasses: 0
                }
            },
            byTeacher: {},
            byClassroom: {}
        };

        // Group schedules by class
        const classSchedules = new Map<number, ClassSchedule[]>();
        schedules.forEach(schedule => {
            if (!classSchedules.has(schedule.classId)) {
                classSchedules.set(schedule.classId, []);
            }
            classSchedules.get(schedule.classId)?.push(schedule);
        });

        // Process class types
        classSchedules.forEach((schedules, classId) => {
            const className = schedules[0].class?.className?.toLowerCase() || '';
            const type: ClassType = className.includes('tutorial') ? 'tutorial' :
                                  className.includes('minispeaking') ? 'minispeaking' :
                                  'regular';

            stats.byClassType[type].totalClasses++;
            stats.byClassType[type].averageSessionsPerClass += schedules.length;
            
            const lastScheduleDate = new Date(schedules[schedules.length - 1].scheduleDate);
            if (new Date() > lastScheduleDate) {
                stats.byClassType[type].completedClasses++;
            }
        });

        // Calculate averages
        (['regular', 'tutorial', 'minispeaking'] as const).forEach(type => {
            if (stats.byClassType[type].totalClasses > 0) {
                stats.byClassType[type].averageSessionsPerClass = Math.round(
                    stats.byClassType[type].averageSessionsPerClass / stats.byClassType[type].totalClasses
                );
            }
        });

        // Process teacher statistics
        schedules.forEach(schedule => {
            if (schedule.teacher?.id) {
                stats.byTeacher[schedule.teacher.id] = (stats.byTeacher[schedule.teacher.id] || 0) + 1;
            }
        });

        // Process classroom statistics
        schedules.forEach(schedule => {
            const roomId = typeof schedule.room === 'object' && schedule.room !== null ? (schedule.room as Room | RoomReference).id : 0;
            if (roomId) {
                stats.byClassroom[roomId] = (stats.byClassroom[roomId] || 0) + 1;
            }
        });

        return stats;
    }

    async generateSchedules(params: any) {
        const classes = await AppDataSource.getRepository(Class).find({
            relations: ['course', 'classroom', 'classTeachers'],
            where: {
                startDate: Between(new Date(params.startDate), new Date(params.endDate)),
                endDate: Between(new Date(params.startDate), new Date(params.endDate)),
                deletedAt: IsNull()
            }
        });

        const schedules = [];
        for (const cls of classes) {
            if (!cls.startDate || !cls.endDate || !cls.classroom) {
                continue;
            }

            const classSchedules = await this.generateSchedulesForClass(cls);
            schedules.push(...classSchedules);
        }

        await AppDataSource.getRepository(ClassSchedule).save(schedules);

        return {
            totalClasses: classes.length,
            totalSchedules: schedules.length,
            schedules
        };
    }

    async checkConflicts() {
        const conflicts = await this.findScheduleConflicts();
        return {
            totalConflicts: conflicts.length,
            conflicts
        };
    }

    async resolveConflicts(params: ConflictResolutionParams): Promise<ConflictResolutionResult> {
        const conflicts = await this.findScheduleConflicts();
        const resolved: ResolvedConflict[] = [];

        for (const conflict of conflicts) {
            const resolution = await this.resolveConflict(conflict, params);
            if (resolution) {
                resolved.push(resolution);
            }
        }

        return {
            totalResolved: resolved.length,
            resolved,
            remainingConflicts: conflicts.length - resolved.length
        };
    }

    async getStatistics() {
        const schedules = await AppDataSource.getRepository(ClassSchedule).find({
            relations: ['class', 'room', 'teacher'],
            where: {
                deletedAt: IsNull()
            }
        });

        const stats = {
            totalSchedules: schedules.length,
            byClassType: {
                regular: 0,
                tutorial: 0,
                minispeaking: 0
            },
            byTeacher: {} as Record<number, number>,
            byClassroom: {} as Record<number, number>
        };

        schedules.forEach(schedule => {
            // Count by class type
            if (schedule.class?.className?.toLowerCase().includes('tutorial')) {
                stats.byClassType.tutorial++;
            } else if (schedule.class?.className?.toLowerCase().includes('minispeaking')) {
                stats.byClassType.minispeaking++;
            } else {
                stats.byClassType.regular++;
            }

            // Count by teacher
            if (schedule.teacher?.id) {
                stats.byTeacher[schedule.teacher.id] = (stats.byTeacher[schedule.teacher.id] || 0) + 1;
            }

            // Count by room
            const roomId = typeof schedule.room === 'object' && schedule.room !== null ? (schedule.room as Room | RoomReference).id : 0;
            if (roomId) {
                stats.byClassroom[roomId] = (stats.byClassroom[roomId] || 0) + 1;
            }
        });

        return stats;
    }

    private async resolveConflict(
        conflict: ScheduleConflict,
        params: ConflictResolutionParams
    ): Promise<ResolvedConflict | null> {
        if (!conflict.shift || !conflict.room || conflict.classes.length === 0) {
            return null;
        }

        // Tìm phòng thay thế
        let alternativeRoom: Room | null = null;
        if (params.alternativeRoomId) {
            alternativeRoom = await this.roomRepo.findOne({
                where: { id: params.alternativeRoomId }
            });
        } else {
            const availableRooms = await this.findAvailableReplacementRooms(
                conflict.scheduleDate,
                conflict.shift.startTime,
                conflict.shift.endTime,
                conflict.classes[0].numberOfStudents
            );
            if (availableRooms.length > 0) {
                alternativeRoom = availableRooms[0];
            }
        }

        if (!alternativeRoom && !params.forceResolve) {
            return null;
        }

        // Tìm lịch học hiện tại
        const schedule = await this.classScheduleRepo.findOne({
            where: {
                classId: conflict.classes[0].id,
                scheduleDate: conflict.scheduleDate
            }
        });

        if (!schedule) {
            return null;
        }

        // Lưu thông tin lịch học cũ
        const originalSchedule = {
            classId: conflict.classes[0].id,
            className: conflict.classes[0].className,
            roomId: conflict.room.id,
            scheduleDate: conflict.scheduleDate,
            shiftId: conflict.shift.id
        };

        // Thay đổi phòng học nếu có phòng thay thế
        if (alternativeRoom) {
            await this.replaceRoom(schedule.id, alternativeRoom.id);
        }

        // Thay đổi ca học nếu được chỉ định
        if (params.alternativeShiftId) {
            await this.classScheduleRepo.update(schedule.id, {
                shiftId: params.alternativeShiftId
            });
        }

        // Lưu thông tin lịch học mới
        const newSchedule = {
            classId: conflict.classes[0].id,
            className: conflict.classes[0].className,
            roomId: alternativeRoom ? alternativeRoom.id : conflict.room.id,
            scheduleDate: conflict.scheduleDate,
            shiftId: params.alternativeShiftId || conflict.shift.id
        };

        return {
            originalSchedule,
            newSchedule
        };
    }

    async findSchedulesByRoom(roomId: number, startDate: Date, endDate: Date): Promise<ClassSchedule[]> {
        try {
            console.log('Finding schedules for room:', roomId, 'from', startDate, 'to', endDate);
            const schedules = await this.classScheduleRepo.findSchedulesByRoom(roomId, startDate, endDate);
            console.log('Found schedules:', schedules);
            if (!schedules || schedules.length === 0) {
                return [];
            }
            return schedules;
        } catch (error) {
            console.error('Error in findSchedulesByRoom:', error);
            throw new AppError('Failed to fetch room schedules', 500);
        }
    }
}
