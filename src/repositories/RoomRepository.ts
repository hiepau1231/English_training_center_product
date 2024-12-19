import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Room } from '../entities/Room';
import { AppDataSource } from '../config/database';

export class RoomRepository extends Repository<Room> {
    constructor() {
        super(Room, AppDataSource.manager);
    }

    async findAvailableRooms(): Promise<Room[]> {
        return this.find({
            where: { status: 'available' }
        });
    }

    async findRoomWithSchedule(roomId: number, date: Date): Promise<Room | null> {
        return this.findOne({
            where: { id: roomId },
            relations: {
                schedules: {
                    teacher: {
                        level: true
                    },
                    course: true
                }
            }
        });
    }

    async findAvailableRoomsForTimeSlot(date: Date, startTime: string, endTime: string): Promise<Room[]> {
        return this.createQueryBuilder('room')
            .leftJoinAndSelect('room.schedules', 'schedule', 
                'schedule.date = :date AND NOT (schedule.endTime <= :startTime OR schedule.startTime >= :endTime)',
                { date, startTime, endTime }
            )
            .where('room.status = :status', { status: 'available' })
            .andWhere('schedule.id IS NULL')
            .getMany();
    }

    async updateRoomStatus(id: number, status: 'available' | 'occupied' | 'maintenance'): Promise<Room | null> {
        await this.update(id, { status });
        return this.findOne({
            where: { id }
        });
    }

    async findRoomsByCapacity(minCapacity: number): Promise<Room[]> {
        return this.find({
            where: {
                capacity: MoreThanOrEqual(minCapacity),
                status: 'available'
            }
        });
    }
}

export const roomRepository = AppDataSource.getRepository(Room).extend({
    findAvailableRooms(): Promise<Room[]> {
        return this.find({
            where: { status: 'available' }
        });
    },

    findRoomWithSchedule(roomId: number, date: Date): Promise<Room | null> {
        return this.findOne({
            where: { id: roomId },
            relations: {
                schedules: {
                    teacher: {
                        level: true
                    },
                    course: true
                }
            }
        });
    },

    findAvailableRoomsForTimeSlot(date: Date, startTime: string, endTime: string): Promise<Room[]> {
        return this.createQueryBuilder('room')
            .leftJoinAndSelect('room.schedules', 'schedule', 
                'schedule.date = :date AND NOT (schedule.endTime <= :startTime OR schedule.startTime >= :endTime)',
                { date, startTime, endTime }
            )
            .where('room.status = :status', { status: 'available' })
            .andWhere('schedule.id IS NULL')
            .getMany();
    }
}); 