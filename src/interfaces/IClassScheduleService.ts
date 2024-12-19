import { ClassSchedule } from "../entities/ClassSchedule";
import { Teacher } from "../entities/Teacher";
import { Room } from "../entities/Room";

export interface IClassScheduleService {
    // Xem số lớp đang dạy trong ngày
    getDailySchedules(date: Date): Promise<{
        totalClasses: number;
        schedules: ClassSchedule[];
    }>;

    // Xem thông tin chi tiết lớp học
    getScheduleDetails(scheduleId: number): Promise<ClassSchedule>;

    // Thay thế giáo viên
    replaceTeacher(scheduleId: number, newTeacherId: number): Promise<ClassSchedule>;

    // Thay đổi phòng học
    replaceRoom(scheduleId: number, newRoomId: number): Promise<ClassSchedule>;

    // Thay đổi giờ dạy
    rescheduleClass(
        scheduleId: number,
        newStartTime: string,
        newEndTime: string
    ): Promise<ClassSchedule>;

    // Tìm giáo viên có thể thay thế
    findAvailableReplacementTeachers(
        scheduleId: number,
        date: Date,
        startTime: string,
        endTime: string
    ): Promise<Teacher[]>;

    // Tìm phòng học có thể thay thế
    findAvailableReplacementRooms(
        date: Date,
        startTime: string,
        endTime: string,
        minCapacity?: number
    ): Promise<Room[]>;
} 