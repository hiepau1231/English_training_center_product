import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { ClassSchedule } from '../entities/ClassSchedule';
import { AppDataSource } from '../data-source';

interface FindScheduleOptions {
    classId?: number;
    roomId?: number;
    teacherId?: number;
    startDate?: Date;
    endDate?: Date;
}

export class ScheduleRepository extends Repository<ClassSchedule> {
    constructor() {
        super(ClassSchedule, AppDataSource.manager);
    }

    async findSchedulesByRoom(roomId: number, startDate?: Date, endDate?: Date): Promise<ClassSchedule[]> {
        const queryBuilder = this.createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.class', 'class')
            .leftJoinAndSelect('schedule.teacher', 'teacher')
            .leftJoinAndSelect('schedule.room', 'room')
            .where('room.id = :roomId', { roomId });

        if (startDate && endDate) {
            queryBuilder.andWhere('schedule.created_at BETWEEN :startDate AND :endDate', {
                startDate,
                endDate
            });
        }

        return queryBuilder
            .orderBy('schedule.created_at', 'ASC')
            .getMany();
    }

    async findSchedulesByMultipleCriteria(options: FindScheduleOptions): Promise<ClassSchedule[]> {
        const queryBuilder = this.createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.class', 'class')
            .leftJoinAndSelect('schedule.teacher', 'teacher')
            .leftJoinAndSelect('schedule.room', 'room');

        if (options.classId) {
            queryBuilder.andWhere('class.id = :classId', { classId: options.classId });
        }

        if (options.roomId) {
            queryBuilder.andWhere('room.id = :roomId', { roomId: options.roomId });
        }

        if (options.teacherId) {
            queryBuilder.andWhere('teacher.id = :teacherId', { teacherId: options.teacherId });
        }

        if (options.startDate && options.endDate) {
            queryBuilder.andWhere('schedule.created_at BETWEEN :startDate AND :endDate', {
                startDate: options.startDate,
                endDate: options.endDate
            });
        }

        return queryBuilder
            .orderBy('schedule.created_at', 'ASC')
            .getMany();
    }

    async findOverlappingSchedules(roomId: number, startDate: Date, endDate: Date): Promise<ClassSchedule[]> {
        return this.createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.class', 'class')
            .leftJoinAndSelect('schedule.room', 'room')
            .where('room.id = :roomId', { roomId })
            .andWhere(
                '(class.startDate <= :endDate AND class.endDate >= :startDate)',
                { startDate, endDate }
            )
            .getMany();
    }

    async findTeacherSchedules(teacherId: number, startDate?: Date, endDate?: Date): Promise<ClassSchedule[]> {
        const queryBuilder = this.createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.class', 'class')
            .leftJoinAndSelect('schedule.teacher', 'teacher')
            .leftJoinAndSelect('schedule.room', 'room')
            .where('teacher.id = :teacherId', { teacherId });

        if (startDate && endDate) {
            queryBuilder.andWhere('schedule.created_at BETWEEN :startDate AND :endDate', {
                startDate,
                endDate
            });
        }

        return queryBuilder
            .orderBy('schedule.created_at', 'ASC')
            .getMany();
    }
} 