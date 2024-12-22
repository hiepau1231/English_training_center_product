import { Repository } from 'typeorm';
import { Teacher } from '../entities/Teacher';
import { AppDataSource } from '../data-source';

export class TeacherRepository extends Repository<Teacher> {
    constructor() {
        super(Teacher, AppDataSource.manager);
    }

    async findByName(name: string): Promise<Teacher | null> {
        return this.findOne({ where: { teacherName: name } });
    }

    async updateTeacherWorkingStatus(teacherId: number, isFulltime: boolean, isParttime: boolean): Promise<void> {
        await this.update(teacherId, {
            isFulltime,
            isParttime
        });
    }

    async findTeachersByLevelAndStatus(levelId: number, isDeleted: boolean = false): Promise<Teacher[]> {
        return this.find({
            where: {
                coursesLevelId: levelId,
                isDeleted: isDeleted
            },
            relations: ['level']
        });
    }
} 