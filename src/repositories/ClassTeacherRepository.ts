import { Repository, FindOptionsWhere } from 'typeorm';
import { ClassTeacher } from '../entities/ClassTeacher';
import { AppDataSource } from '../data-source';

interface FindTeacherOptions {
    classId?: number;
    teacherId?: number;
    role?: string;
}

export class ClassTeacherRepository extends Repository<ClassTeacher> {
    constructor() {
        super(ClassTeacher, AppDataSource.manager);
    }

    async findTeachersByClass(classId: number): Promise<ClassTeacher[]> {
        return this.find({
            where: { classId },
            relations: ['teacher', 'class'],
            order: {
                role: 'ASC'
            }
        });
    }

    async findTeachersByMultipleCriteria(options: FindTeacherOptions): Promise<ClassTeacher[]> {
        const where: FindOptionsWhere<ClassTeacher> = {};

        if (options.classId) {
            where.classId = options.classId;
        }

        if (options.teacherId) {
            where.teacherId = options.teacherId;
        }

        if (options.role) {
            where.role = options.role;
        }

        return this.find({
            where,
            relations: ['teacher', 'class'],
            order: {
                role: 'ASC'
            }
        });
    }

    async findTeachersByRoom(roomId: number): Promise<ClassTeacher[]> {
        return this.createQueryBuilder('classTeacher')
            .leftJoinAndSelect('classTeacher.teacher', 'teacher')
            .leftJoinAndSelect('classTeacher.class', 'class')
            .where('class.classroom_id = :roomId', { roomId })
            .orderBy('classTeacher.role', 'ASC')
            .getMany();
    }

    async findActiveTeachersByTimeSlot(startDate: Date, endDate: Date): Promise<ClassTeacher[]> {
        return this.createQueryBuilder('classTeacher')
            .leftJoinAndSelect('classTeacher.teacher', 'teacher')
            .leftJoinAndSelect('classTeacher.class', 'class')
            .where('class.startDate <= :endDate AND class.endDate >= :startDate', {
                startDate,
                endDate
            })
            .orderBy('teacher.name', 'ASC')
            .getMany();
    }
} 