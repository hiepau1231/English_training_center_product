import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Room } from '../entities/Room';
import { AppDataSource } from '../data-source';
import { Class } from '../entities/Class';
import { ClassTeacher } from '../entities/ClassTeacher';
import { Teacher } from '../entities/Teacher';
import { ClassSchedule } from '../entities/ClassSchedule';

interface FindRoomOptions {
    type?: string;
    capacity?: number;
    status?: boolean;
    startDate?: Date;
    endDate?: Date;
}

interface ScheduleQueryResult {
    id: number;
    scheduleDate: Date;
    shiftId: number;
    teacherId: number;
    teacherName: string;
    shiftName: string;
}

interface TransformedTeacher {
    id: number;
    teacherName: string;
    experience: string;
    isForeign: boolean;
    isFulltime: boolean;
    phoneNumber: string;
}

interface TransformedClassTeacher {
    id: number;
    classId: number;
    teacherId: number;
    role: string;
    teacher: TransformedTeacher;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    isDeleted: boolean;
    class: Class;
}

interface TransformedClass extends Omit<Class, 'schedules' | 'classTeachers'> {
    schedules: ScheduleQueryResult[];
    classTeachers: TransformedClassTeacher[];
}

export class RoomRepository extends Repository<Room> {
    constructor() {
        const repository = AppDataSource.getRepository(Room);
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async findByRoomNumber(roomNumber: string): Promise<Room | null> {
        return this.findOne({ where: { roomNumber } });
    }

    async findAvailableRooms(): Promise<Room[]> {
        return this.find({ where: { status: false } });
    }

    async findRoomWithTeachers(roomId: number): Promise<Room | null> {
        try {
            // Build query with all necessary joins
            const queryBuilder = this.createQueryBuilder('room')
                // Join with classes
                .leftJoinAndSelect('room.classes', 'class', 'class.classroom_id = room.id AND class.is_deleted = false')
                
                // Join with class teachers and teacher info
                .leftJoinAndSelect('class.classTeachers', 'classTeacher', 'classTeacher.class_id = class.id AND classTeacher.is_deleted = false')
                .leftJoinAndSelect('classTeacher.teacher', 'teacher', 'teacher.is_deleted = false')
                
                // Join with course
                .leftJoinAndSelect('class.course', 'course', 'course.is_deleted = false')
                
                // Main conditions
                .where('room.id = :roomId', { roomId })
                .andWhere('room.is_deleted = false')
                
                // Ordering
                .orderBy('class.start_date', 'ASC');

            const room = await queryBuilder.getOne();

            if (!room) {
                return null;
            }

            // Transform data to include only valid records
            if (room.classes) {
                const transformedClasses = await Promise.all(room.classes
                    .filter(cls => cls && !cls.isDeleted)
                    .map(async cls => {
                        // Process class teachers
                        let transformedClassTeachers: TransformedClassTeacher[] = [];
                        if (cls.classTeachers) {
                            transformedClassTeachers = cls.classTeachers
                                .filter(ct => ct && !ct.isDeleted && ct.teacher && !ct.teacher.isDeleted)
                                .map(ct => ({
                                    ...ct,
                                    teacher: {
                                        id: ct.teacher.id,
                                        teacherName: ct.teacher.teacherName,
                                        experience: ct.teacher.experience,
                                        isForeign: ct.teacher.isForeign,
                                        isFulltime: ct.teacher.isFulltime,
                                        phoneNumber: ct.teacher.phoneNumber
                                    }
                                })) as TransformedClassTeacher[];
                        }

                        // Get schedules for this class
                        const schedules: ScheduleQueryResult[] = await this.manager.query(`
                            SELECT 
                                cs.id,
                                cs.schedule_date as "scheduleDate",
                                cs.shift_id as "shiftId",
                                cs.teacher_id as "teacherId",
                                t.teacher_name as "teacherName",
                                s.teaching_shift as "shiftName"
                            FROM class_schedules cs
                            LEFT JOIN teachers t ON cs.teacher_id = t.id
                            LEFT JOIN shifts s ON cs.shift_id = s.id
                            WHERE cs.class_id = ? 
                            AND cs.room_id = ? 
                            AND cs.is_deleted = false 
                            ORDER BY cs.schedule_date ASC
                        `, [cls.id, roomId]);

                        const transformedClass: TransformedClass = {
                            ...cls,
                            course: cls.course || null,
                            schedules,
                            classTeachers: transformedClassTeachers
                        };

                        return transformedClass;
                    }));

                (room as any).classes = transformedClasses;
            }

            return room;
        } catch (error) {
            console.error('Error in findRoomWithTeachers:', error);
            throw error;
        }
    }

    async findRoomsByMultipleCriteria(options: FindRoomOptions): Promise<Room[]> {
        const queryBuilder = this.createQueryBuilder('room')
            .leftJoinAndSelect('room.classes', 'class')
            .where('1=1');

        if (options.type) {
            console.log('Searching for type:', options.type);
            queryBuilder.andWhere('room.type = :type', { type: options.type });
        }

        if (options.capacity) {
            queryBuilder.andWhere('room.capacity >= :capacity', { capacity: options.capacity });
        }

        if (options.status !== undefined) {
            queryBuilder.andWhere('room.status = :status', { status: options.status });
        }

        queryBuilder.andWhere('room.deletedAt IS NULL');
        queryBuilder.orderBy('room.classroom_name', 'ASC');

        console.log('Generated query:', queryBuilder.getSql());
        console.log('Query parameters:', queryBuilder.getParameters());

        return queryBuilder.getMany();
    }

    async getRoomUsageHistory(roomId: number, startDate?: Date, endDate?: Date): Promise<Room | null> {
        const queryBuilder = this.createQueryBuilder('room')
            .leftJoinAndSelect('room.classes', 'class')
            .leftJoinAndSelect('class.schedules', 'schedule')
            .leftJoinAndSelect('class.classTeachers', 'classTeacher')
            .leftJoinAndSelect('classTeacher.teacher', 'teacher')
            .where('room.id = :roomId', { roomId });

        if (startDate && endDate) {
            queryBuilder.andWhere('class.startDate BETWEEN :startDate AND :endDate', {
                startDate,
                endDate
            });
        }

        return queryBuilder.getOne();
    }

    async findAvailableRoomsByTimeSlot(startDate: Date, endDate: Date, capacity?: number): Promise<Room[]> {
        const queryBuilder = this.createQueryBuilder('room')
            .leftJoinAndSelect('room.classes', 'class')
            .where('room.status = :status', { status: false });

        queryBuilder.andWhere(qb => {
            const subQuery = qb.subQuery()
                .select('1')
                .from('classes', 'c')
                .where('c.classroom_id = room.id')
                .andWhere('c.deleted_at IS NULL')
                .andWhere('(c.start_date <= :endDate AND c.end_date >= :startDate)')
                .getQuery();
            return 'NOT EXISTS (' + subQuery + ')';
        });

        if (capacity) {
            queryBuilder.andWhere('room.capacity >= :capacity', { capacity });
        }

        queryBuilder.setParameters({ startDate, endDate });

        return queryBuilder.getMany();
    }
} 