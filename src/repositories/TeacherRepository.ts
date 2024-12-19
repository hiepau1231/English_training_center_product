import { Repository, In } from 'typeorm';
import { Teacher } from '../entities/Teacher';
import { AppDataSource } from '../config/database';

export class TeacherRepository extends Repository<Teacher> {
    constructor() {
        super(Teacher, AppDataSource.manager);
    }

    async findByLevelId(levelId: number): Promise<Teacher[]> {
        return this.find({
            where: { levelId },
            relations: {
                level: true
            }
        });
    }

    async findAvailableTeachers(): Promise<Teacher[]> {
        return this.find({
            where: { status: 'active' },
            relations: {
                level: true
            }
        });
    }

    async findTeachersByLevelAndStatus(levelId: number, status: 'active' | 'inactive' | 'busy'): Promise<Teacher[]> {
        return this.find({
            where: {
                levelId,
                status
            },
            relations: {
                level: true
            }
        });
    }

    async findTeachersWithSchedules(date: Date): Promise<Teacher[]> {
        return this.find({
            relations: {
                schedules: true,
                level: true
            },
            where: {
                schedules: {
                    date
                }
            }
        });
    }

    async updateTeacherStatus(id: number, status: 'active' | 'inactive' | 'busy'): Promise<Teacher | null> {
        await this.update(id, { status });
        return this.findOne({
            where: { id },
            relations: {
                level: true
            }
        });
    }
}

export const teacherRepository = AppDataSource.getRepository(Teacher).extend({
    findByLevelId(levelId: number): Promise<Teacher[]> {
        return this.find({
            where: { levelId },
            relations: {
                level: true
            }
        });
    },

    findAvailableTeachers(): Promise<Teacher[]> {
        return this.find({
            where: { status: 'active' },
            relations: {
                level: true
            }
        });
    },

    findTeachersByLevelAndStatus(levelId: number, status: 'active' | 'inactive' | 'busy'): Promise<Teacher[]> {
        return this.find({
            where: {
                levelId,
                status
            },
            relations: {
                level: true
            }
        });
    },

    findTeachersWithSchedules(date: Date): Promise<Teacher[]> {
        return this.find({
            relations: {
                schedules: true,
                level: true
            },
            where: {
                schedules: {
                    date
                }
            }
        });
    }
}); 