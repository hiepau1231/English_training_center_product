import { Repository, Between } from 'typeorm';
import { ClassSchedule } from '../entities/ClassSchedule';
import { AppDataSource } from '../config/database';

export class ClassScheduleRepository extends Repository<ClassSchedule> {
    constructor() {
        super(ClassSchedule, AppDataSource.manager);
    }

    async findSchedulesByDate(date: Date): Promise<ClassSchedule[]> {
        return this.find({
            where: { date },
            relations: {
                teacher: {
                    level: true
                },
                room: true,
                course: true
            }
        });
    }

    async findSchedulesByRoom(roomId: number, date: Date): Promise<ClassSchedule[]> {
        return this.find({
            where: {
                roomId,
                date
            },
            relations: {
                teacher: {
                    level: true
                },
                room: true,
                course: true
            }
        });
    }

    async findSchedulesByTeacher(teacherId: number, date: Date): Promise<ClassSchedule[]> {
        return this.find({
            where: {
                teacherId,
                date
            },
            relations: {
                teacher: {
                    level: true
                },
                room: true,
                course: true
            }
        });
    }

    async findScheduleDetail(scheduleId: number): Promise<ClassSchedule | null> {
        return this.findOne({
            where: { id: scheduleId },
            relations: {
                teacher: {
                    level: true
                },
                room: true,
                course: true
            }
        });
    }

    async updateTeacher(scheduleId: number, teacherId: number): Promise<ClassSchedule | null> {
        await this.update(scheduleId, { teacherId });
        return this.findScheduleDetail(scheduleId);
    }

    async updateRoom(scheduleId: number, roomId: number): Promise<ClassSchedule | null> {
        await this.update(scheduleId, { roomId });
        return this.findScheduleDetail(scheduleId);
    }

    async updateScheduleTime(
        scheduleId: number,
        startTime: string,
        endTime: string
    ): Promise<ClassSchedule | null> {
        await this.update(scheduleId, { startTime, endTime });
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
            .where('schedule.roomId = :roomId', { roomId })
            .andWhere('schedule.date = :date', { date })
            .andWhere(
                'NOT (schedule.endTime <= :startTime OR schedule.startTime >= :endTime)',
                { startTime, endTime }
            );

        if (excludeScheduleId) {
            query.andWhere('schedule.id != :excludeScheduleId', { excludeScheduleId });
        }

        const conflictingSchedules = await query.getCount();
        return conflictingSchedules > 0;
    }
}

export const classScheduleRepository = AppDataSource.getRepository(ClassSchedule).extend({
    findSchedulesByDate(date: Date): Promise<ClassSchedule[]> {
        return this.find({
            where: { date },
            relations: {
                teacher: {
                    level: true
                },
                room: true,
                course: true
            }
        });
    },

    findSchedulesByRoom(roomId: number, date: Date): Promise<ClassSchedule[]> {
        return this.find({
            where: {
                roomId,
                date
            },
            relations: {
                teacher: {
                    level: true
                },
                room: true,
                course: true
            }
        });
    },

    findScheduleDetail(scheduleId: number): Promise<ClassSchedule | null> {
        return this.findOne({
            where: { id: scheduleId },
            relations: {
                teacher: {
                    level: true
                },
                room: true,
                course: true
            }
        });
    }
}); 