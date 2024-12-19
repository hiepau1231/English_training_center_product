import { Repository } from 'typeorm';
import { TeacherLevel } from '../entities/TeacherLevel';
import { AppDataSource } from '../config/database';

export class TeacherLevelRepository extends Repository<TeacherLevel> {
    constructor() {
        super(TeacherLevel, AppDataSource.manager);
    }

    async findByName(name: string): Promise<TeacherLevel | null> {
        return this.findOne({ where: { name } });
    }

    async findAllWithTeachers(): Promise<TeacherLevel[]> {
        return this.find({
            relations: {
                teachers: true
            }
        });
    }

    async createLevel(name: string, description?: string): Promise<TeacherLevel> {
        const level = new TeacherLevel();
        level.name = name;
        if (description) {
            level.description = description;
        }
        return this.save(level);
    }
}

export const teacherLevelRepository = AppDataSource.getRepository(TeacherLevel).extend({
    findByName(name: string): Promise<TeacherLevel | null> {
        return this.findOne({ where: { name } });
    },
    findAllWithTeachers(): Promise<TeacherLevel[]> {
        return this.find({
            relations: {
                teachers: true
            }
        });
    }
}); 