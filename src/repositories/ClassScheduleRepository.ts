import { Repository, Between, IsNull, Like } from 'typeorm';
import { ClassSchedule } from '../entities/ClassSchedule';
import { AppDataSource } from '../data-source';
import { Room } from '../entities/Room';
import { Teacher } from '../entities/Teacher';
import { Course } from '../entities/Course';
import { Shift } from '../entities/Shift';

interface FindScheduleOptions {
    date?: Date;
    startDate?: Date;
    endDate?: Date;
    roomId?: number;
    teacherId?: number;
    excludeScheduleId?: number;
}

interface TimeSlot {
    startTime: string;
    endTime: string;
}

export class ClassScheduleRepository extends Repository<ClassSchedule> {
    constructor() {
        super(ClassSchedule, AppDataSource.manager);
    }

    async findSchedulesByDate(date: Date): Promise<ClassSchedule[]> {
        return this.createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.teacher', 'teacher')
            .leftJoinAndSelect('teacher.level', 'level')
            .leftJoinAndSelect('schedule.room', 'room')
            .leftJoinAndSelect('schedule.course', 'course')
            .leftJoinAndSelect('schedule.shift', 'shift')
            .where('schedule.scheduleDate = :date', { date })
            .andWhere('schedule.deletedAt IS NULL')
            .getMany();
    }

    async findSchedulesByRoom(
        roomId: number,
        startDate: Date,
        endDate: Date
    ): Promise<ClassSchedule[]> {
        try {
            console.log('Repository - Finding schedules for room:', roomId, 'from', startDate, 'to', endDate);
            
            // First, let's check if there are any schedules at all
            const totalCount = await this.createQueryBuilder('schedule')
                .where('schedule.deletedAt IS NULL')
                .getCount();
            console.log('Total schedules in database:', totalCount);

            // Then check schedules for this room
            const roomCount = await this.createQueryBuilder('schedule')
                .where('schedule.roomId = :roomId', { roomId })
                .andWhere('schedule.deletedAt IS NULL')
                .getCount();
            console.log('Schedules for room', roomId, ':', roomCount);

            const queryBuilder = this.createQueryBuilder('schedule')
                .where('schedule.roomId = :roomId', { roomId })
                .andWhere('schedule.scheduleDate BETWEEN :startDate AND :endDate', { 
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                })
                .andWhere('schedule.deletedAt IS NULL');

            // Log the generated SQL query and parameters
            const [query, parameters] = queryBuilder.getQueryAndParameters();
            console.log('Generated SQL:', query);
            console.log('Query parameters:', parameters);

            const schedules = await queryBuilder.getMany();
            console.log('Repository - Found schedules:', schedules);

            // If we found schedules, load the relations
            if (schedules.length > 0) {
                return this.createQueryBuilder('schedule')
                    .leftJoinAndSelect('schedule.teacher', 'teacher')
                    .leftJoinAndSelect('teacher.level', 'teacherLevel')
                    .leftJoinAndSelect('schedule.room', 'room')
                    .leftJoinAndSelect('schedule.shift', 'shift')
                    .leftJoinAndSelect('schedule.class', 'class')
                    .leftJoinAndSelect('class.course', 'course')
                    .where('schedule.id IN (:...ids)', { ids: schedules.map(s => s.id) })
                    .orderBy('schedule.scheduleDate', 'ASC')
                    .addOrderBy('shift.teaching_shift', 'ASC')
                    .getMany();
            }

            return schedules;
        } catch (error) {
            console.error('Repository - Error in findSchedulesByRoom:', error);
            throw error;
        }
    }

    async findSchedulesByTeacher(
        teacherId: number,
        date: Date
    ): Promise<ClassSchedule[]> {
        return this.createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.teacher', 'teacher')
            .leftJoinAndSelect('teacher.level', 'level')
            .leftJoinAndSelect('schedule.room', 'room')
            .leftJoinAndSelect('schedule.course', 'course')
            .leftJoinAndSelect('schedule.shift', 'shift')
            .where('schedule.teacherId = :teacherId', { teacherId })
            .andWhere('schedule.scheduleDate = :date', { date })
            .andWhere('schedule.deletedAt IS NULL')
            .getMany();
    }

    async findAvailableRooms(
        date: Date,
        startTime: string,
        endTime: string,
        minCapacity: number = 0
    ): Promise<Room[]> {
        const roomRepo = AppDataSource.getRepository(Room);
        const availableRooms = await roomRepo.createQueryBuilder('room')
            .where('room.capacity >= :minCapacity', { minCapacity })
            .andWhere('room.deletedAt IS NULL')
            .getMany();

        const occupiedRoomIds = await this.createQueryBuilder('schedule')
            .leftJoin('schedule.shift', 'shift')
            .select('DISTINCT schedule.roomId')
            .where('schedule.scheduleDate = :date', { date })
            .andWhere('shift.startTime = :startTime', { startTime })
            .andWhere('shift.endTime = :endTime', { endTime })
            .andWhere('schedule.deletedAt IS NULL')
            .getRawMany();

        const occupiedIds = occupiedRoomIds.map(r => r.roomId);
        return availableRooms.filter(room => !occupiedIds.includes(room.id));
    }

    async findScheduleDetail(scheduleId: number): Promise<ClassSchedule | null> {
        return this.createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.teacher', 'teacher')
            .leftJoinAndSelect('teacher.level', 'level')
            .leftJoinAndSelect('schedule.room', 'room')
            .leftJoinAndSelect('schedule.course', 'course')
            .leftJoinAndSelect('schedule.shift', 'shift')
            .where('schedule.id = :scheduleId', { scheduleId })
            .andWhere('schedule.deletedAt IS NULL')
            .getOne();
    }

    async updateTeacher(
        scheduleId: number,
        newTeacherId: number
    ): Promise<ClassSchedule | null> {
        await this.update(scheduleId, { teacherId: newTeacherId });
        return this.findScheduleDetail(scheduleId);
    }

    async updateRoom(
        scheduleId: number,
        newRoomId: number
    ): Promise<ClassSchedule | null> {
        await this.update(scheduleId, { roomId: newRoomId });
        return this.findScheduleDetail(scheduleId);
    }

    async updateScheduleTime(
        scheduleId: number,
        startTime: string,
        endTime: string
    ): Promise<ClassSchedule | null> {
        const shiftRepo = AppDataSource.getRepository(Shift);
        const shift = await shiftRepo.findOne({
            where: {
                startTime: startTime,
                endTime: endTime,
                deletedAt: IsNull()
            }
        });

        if (!shift) {
            throw new Error('No shift found for the given time slot');
        }

        await this.update(scheduleId, { shiftId: shift.id });
        return this.findScheduleDetail(scheduleId);
    }

    async checkTimeConflict(
        roomId: number,
        date: Date,
        startTime: string,
        endTime: string,
        excludeScheduleId?: number
    ): Promise<boolean> {
        const query = this.createQueryBuilder('schedule')
            .leftJoin('schedule.shift', 'shift')
            .where('schedule.roomId = :roomId', { roomId })
            .andWhere('schedule.scheduleDate = :date', { date })
            .andWhere('shift.startTime = :startTime', { startTime })
            .andWhere('shift.endTime = :endTime', { endTime })
            .andWhere('schedule.deletedAt IS NULL');

        if (excludeScheduleId) {
            query.andWhere('schedule.id != :excludeScheduleId', { excludeScheduleId });
        }

        const count = await query.getCount();
        return count > 0;
    }

    async findTeacherSchedules(
        teacherId: number,
        date: Date,
        startTime: string,
        endTime: string,
        excludeScheduleId?: number
    ): Promise<ClassSchedule[]> {
        const query = this.createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.shift', 'shift')
            .where('schedule.teacherId = :teacherId', { teacherId })
            .andWhere('schedule.scheduleDate = :date', { date })
            .andWhere('shift.startTime < :endTime', { endTime })
            .andWhere('shift.endTime > :startTime', { startTime });

        if (excludeScheduleId) {
            query.andWhere('schedule.id != :excludeId', { excludeId: excludeScheduleId });
        }

        return query.getMany();
    }

    async insertTestSchedules(): Promise<void> {
        try {
            // First, let's check if we have a shift
            const shiftRepo = AppDataSource.getRepository(Shift);
            let shift = await shiftRepo.findOne({ where: { id: 1 } });
            if (!shift) {
                // Create a test shift
                shift = new Shift();
                shift.teachingShift = 'Morning Shift (8:00 - 10:00)';
                shift.classId = 661;
                shift.isDeleted = false;
                await shiftRepo.save(shift);
                console.log('Test shift created:', shift);
            }

            // Create a test schedule
            const schedule = new ClassSchedule();
            schedule.roomId = 1;
            schedule.classId = 661; // From the room details we saw earlier
            schedule.scheduleDate = new Date('2024-04-15'); // Start date of the class
            schedule.shiftId = shift.id;
            schedule.teacherId = 1390; // From the room details we saw earlier
            schedule.courseId = 3267; // From the room details we saw earlier
            schedule.isDeleted = false;

            await this.save(schedule);
            console.log('Test schedule inserted successfully');
        } catch (error) {
            console.error('Error inserting test schedule:', error);
            throw error;
        }
    }
} 