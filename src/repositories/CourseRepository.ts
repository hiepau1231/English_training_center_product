import { Repository } from 'typeorm';
import { Course } from '../entities/Course';
import { AppDataSource } from '../config/database';

export class CourseRepository extends Repository<Course> {
    constructor() {
        super(Course, AppDataSource.manager);
    }

    async findByLevel(levelId: number): Promise<Course[]> {
        return this.find({
            where: { levelId }
        });
    }

    async findCourseWithSchedules(courseId: number): Promise<Course | null> {
        return this.findOne({
            where: { id: courseId },
            relations: {
                schedules: {
                    teacher: true,
                    room: true
                }
            }
        });
    }

    async findActiveCoursesWithSchedules(): Promise<Course[]> {
        return this.find({
            relations: {
                schedules: {
                    teacher: true,
                    room: true
                }
            },
            where: {
                schedules: {
                    status: 'in-progress'
                }
            }
        });
    }
}

export const courseRepository = AppDataSource.getRepository(Course).extend({
    findByLevel(levelId: number): Promise<Course[]> {
        return this.find({
            where: { levelId }
        });
    },

    findCourseWithSchedules(courseId: number): Promise<Course | null> {
        return this.findOne({
            where: { id: courseId },
            relations: {
                schedules: {
                    teacher: true,
                    room: true
                }
            }
        });
    },

    findActiveCoursesWithSchedules(): Promise<Course[]> {
        return this.find({
            relations: {
                schedules: {
                    teacher: true,
                    room: true
                }
            },
            where: {
                schedules: {
                    status: 'in-progress'
                }
            }
        });
    }
}); 