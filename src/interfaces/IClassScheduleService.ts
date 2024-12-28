import { ClassSchedule } from "../entities/ClassSchedule";
import { Teacher } from "../entities/Teacher";
import { Room } from "../entities/Room";

export interface IClassScheduleService {
    getAllSchedules(): Promise<{ total: number; schedules: ClassSchedule[] }>;
    getDailySchedules(date: Date): Promise<{ totalClasses: number; schedules: ClassSchedule[] }>;
    getScheduleDetails(scheduleId: number): Promise<ClassSchedule>;
    replaceTeacher(scheduleId: number, newTeacherId: number): Promise<ClassSchedule>;
    replaceRoom(scheduleId: number, newRoomId: number): Promise<ClassSchedule>;
    rescheduleClass(scheduleId: number, startTime: string, endTime: string): Promise<ClassSchedule>;
    findAvailableReplacementTeachers(scheduleId: number, date: Date, startTime: string, endTime: string): Promise<Teacher[]>;
    findAvailableReplacementRooms(date: Date, startTime: string, endTime: string, minCapacity?: number): Promise<Room[]>;
    generateSchedules(params: any): Promise<{ totalClasses: number; totalSchedules: number; schedules: ClassSchedule[] }>;
    checkConflicts(): Promise<{ totalConflicts: number; conflicts: any[] }>;
    resolveConflicts(params: any): Promise<{ totalResolved: number; resolved: any[]; remainingConflicts: number }>;
    getStatistics(): Promise<any>;
} 