import { IClassScheduleService } from "../interfaces/IClassScheduleService";
import { ClassSchedule } from "../entities/ClassSchedule";
import { Teacher } from "../entities/Teacher";
import { Room } from "../entities/Room";
import { ClassScheduleRepository } from "../repositories/ClassScheduleRepository";
import { TeacherRepository } from "../repositories/TeacherRepository";
import { RoomRepository } from "../repositories/RoomRepository";
import { AppError } from "../utils/AppError";

export class ClassScheduleService implements IClassScheduleService {
    constructor(
        private classScheduleRepo: ClassScheduleRepository,
        private teacherRepo: TeacherRepository,
        private roomRepo: RoomRepository
    ) {}

    async getDailySchedules(date: Date): Promise<{ totalClasses: number; schedules: ClassSchedule[] }> {
        const schedules = await this.classScheduleRepo.findSchedulesByDate(date);
        return {
            totalClasses: schedules.length,
            schedules
        };
    }

    async getScheduleDetails(scheduleId: number): Promise<ClassSchedule> {
        const schedule = await this.classScheduleRepo.findScheduleDetail(scheduleId);
        if (!schedule) {
            throw new AppError("Schedule not found", 404);
        }
        return schedule;
    }

    async replaceTeacher(scheduleId: number, newTeacherId: number): Promise<ClassSchedule> {
        // Get current schedule
        const schedule = await this.getScheduleDetails(scheduleId);
        
        // Get new teacher
        const newTeacher = await this.teacherRepo.findOne({
            where: { id: newTeacherId },
            relations: { level: true }
        });

        if (!newTeacher) {
            throw new AppError("New teacher not found", 404);
        }

        // Check if new teacher has same level as current teacher
        if (schedule.teacher.level.id !== newTeacher.level.id) {
            throw new AppError("New teacher must have the same level as current teacher", 400);
        }

        // Check if new teacher is available
        const hasConflict = await this.checkTeacherAvailability(
            newTeacherId,
            schedule.date,
            schedule.startTime,
            schedule.endTime,
            scheduleId
        );

        if (hasConflict) {
            throw new AppError("New teacher is not available at this time", 400);
        }

        // Update teacher status
        await this.teacherRepo.updateTeacherStatus(schedule.teacher.id, "active");
        await this.teacherRepo.updateTeacherStatus(newTeacherId, "busy");

        // Update schedule
        const updatedSchedule = await this.classScheduleRepo.updateTeacher(scheduleId, newTeacherId);
        if (!updatedSchedule) {
            throw new AppError("Failed to update schedule", 500);
        }
        return updatedSchedule;
    }

    async replaceRoom(scheduleId: number, newRoomId: number): Promise<ClassSchedule> {
        // Get current schedule
        const schedule = await this.getScheduleDetails(scheduleId);

        // Check if new room exists and is available
        const newRoom = await this.roomRepo.findOne({
            where: { id: newRoomId }
        });

        if (!newRoom) {
            throw new AppError("New room not found", 404);
        }

        // Check for time conflicts
        const hasConflict = await this.classScheduleRepo.checkTimeConflict(
            newRoomId,
            schedule.date,
            schedule.startTime,
            schedule.endTime,
            scheduleId
        );

        if (hasConflict) {
            throw new AppError("Room is not available at this time", 400);
        }

        // Update room status
        await this.roomRepo.updateRoomStatus(schedule.room.id, "available");
        await this.roomRepo.updateRoomStatus(newRoomId, "occupied");

        // Update schedule
        const updatedSchedule = await this.classScheduleRepo.updateRoom(scheduleId, newRoomId);
        if (!updatedSchedule) {
            throw new AppError("Failed to update schedule", 500);
        }
        return updatedSchedule;
    }

    async rescheduleClass(
        scheduleId: number,
        newStartTime: string,
        newEndTime: string
    ): Promise<ClassSchedule> {
        // Get current schedule
        const schedule = await this.getScheduleDetails(scheduleId);

        // Check for room conflicts
        const hasRoomConflict = await this.classScheduleRepo.checkTimeConflict(
            schedule.roomId,
            schedule.date,
            newStartTime,
            newEndTime,
            scheduleId
        );

        if (hasRoomConflict) {
            throw new AppError("Room is not available at new time", 400);
        }

        // Check for teacher conflicts
        const hasTeacherConflict = await this.checkTeacherAvailability(
            schedule.teacherId,
            schedule.date,
            newStartTime,
            newEndTime,
            scheduleId
        );

        if (hasTeacherConflict) {
            throw new AppError("Teacher is not available at new time", 400);
        }

        // Update schedule
        const updatedSchedule = await this.classScheduleRepo.updateScheduleTime(scheduleId, newStartTime, newEndTime);
        if (!updatedSchedule) {
            throw new AppError("Failed to update schedule", 500);
        }
        return updatedSchedule;
    }

    async findAvailableReplacementTeachers(
        scheduleId: number,
        date: Date,
        startTime: string,
        endTime: string
    ): Promise<Teacher[]> {
        const schedule = await this.getScheduleDetails(scheduleId);
        const currentTeacherLevel = schedule.teacher.level.id;

        // Get all teachers of same level
        const teachers = await this.teacherRepo.findTeachersByLevelAndStatus(
            currentTeacherLevel,
            "active"
        );

        // Filter out teachers with conflicts
        const availableTeachers = [];
        for (const teacher of teachers) {
            const hasConflict = await this.checkTeacherAvailability(
                teacher.id,
                date,
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
        minCapacity?: number
    ): Promise<Room[]> {
        // Get available rooms
        let availableRooms = await this.roomRepo.findAvailableRooms();

        // Filter by capacity if specified
        if (minCapacity) {
            availableRooms = availableRooms.filter(room => room.capacity >= minCapacity);
        }

        // Filter out rooms with conflicts
        const rooms = [];
        for (const room of availableRooms) {
            const hasConflict = await this.classScheduleRepo.checkTimeConflict(
                room.id,
                date,
                startTime,
                endTime
            );
            if (!hasConflict) {
                rooms.push(room);
            }
        }

        return rooms;
    }

    private async checkTeacherAvailability(
        teacherId: number,
        date: Date,
        startTime: string,
        endTime: string,
        excludeScheduleId?: number
    ): Promise<boolean> {
        const teacherSchedules = await this.classScheduleRepo.findSchedulesByTeacher(teacherId, date);
        
        if (excludeScheduleId) {
            const filteredSchedules = teacherSchedules.filter(
                schedule => schedule.id !== excludeScheduleId
            );

            return filteredSchedules.some(schedule => {
                return this.hasTimeOverlap(
                    schedule.startTime,
                    schedule.endTime,
                    startTime,
                    endTime
                );
            });
        }

        return teacherSchedules.some(schedule => {
            return this.hasTimeOverlap(
                schedule.startTime,
                schedule.endTime,
                startTime,
                endTime
            );
        });
    }

    private hasTimeOverlap(
        start1: string,
        end1: string,
        start2: string,
        end2: string
    ): boolean {
        return start1 < end2 && start2 < end1;
    }
} 