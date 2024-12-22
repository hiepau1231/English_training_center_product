import { RoomRepository } from '../repositories/RoomRepository';
import { Room } from '../entities/Room';
import { AppDataSource } from '../data-source';

interface SearchRoomOptions {
    type?: string;
    capacity?: number;
    status?: boolean;
    startDate?: Date;
    endDate?: Date;
}

interface UpdateRoomOptions {
    roomNumber?: string;
    capacity?: number;
    type?: string;
    status?: boolean;
}

export class ClassroomService {
    private roomRepository: RoomRepository;

    constructor() {
        this.roomRepository = new RoomRepository();
    }

    async searchRooms(options: SearchRoomOptions): Promise<Room[]> {
        try {
            // Tìm phòng theo nhiều tiêu chí
            const rooms = await this.roomRepository.findRoomsByMultipleCriteria(options);

            // Nếu có thời gian, kiểm tra thêm lịch sử sử dụng
            if (options.startDate && options.endDate) {
                const availableRooms = await this.roomRepository.findAvailableRoomsByTimeSlot(
                    options.startDate,
                    options.endDate,
                    options.capacity
                );
                return availableRooms;
            }

            return rooms;
        } catch (error: any) {
            const message = error?.message || 'Unknown error searching rooms';
            throw new Error(`Error searching rooms: ${message}`);
        }
    }

    async getRoomDetails(roomId: number): Promise<Room | null> {
        try {
            // Get room details with all related information
            const room = await this.roomRepository.findRoomWithTeachers(roomId);
            
            if (!room) {
                throw new Error(`Room with id ${roomId} not found`);
            }

            // Additional data transformation if needed
            return room;
        } catch (error: any) {
            console.error('Error in getRoomDetails:', error);
            // Re-throw the error to be handled by the controller
            throw new Error(`Error getting room details: ${error.message}`);
        }
    }

    async updateRoom(roomId: number, updateData: UpdateRoomOptions): Promise<Room> {
        try {
            const room = await this.roomRepository.findOne({ where: { id: roomId } });
            if (!room) {
                throw new Error(`Room with id ${roomId} not found`);
            }

            // Cập nhật thông tin phòng
            if (updateData.roomNumber) room.roomNumber = updateData.roomNumber;
            if (updateData.capacity) room.capacity = updateData.capacity;
            if (updateData.type) room.type = updateData.type;
            if (updateData.status !== undefined) room.status = updateData.status;

            // Lưu thay đổi
            return await this.roomRepository.save(room);
        } catch (error: any) {
            const message = error?.message || 'Unknown error updating room';
            throw new Error(`Error updating room: ${message}`);
        }
    }

    async getRoomUsageHistory(roomId: number, startDate?: Date, endDate?: Date, limit: number = 10): Promise<Room | null> {
        try {
            // Kiểm tra phòng tồn tại
            const room = await this.roomRepository.findOne({ 
                where: { id: roomId },
                relations: [
                    'classes', 
                    'classes.classTeachers', 
                    'classes.classTeachers.teacher'
                ]
            });

            if (!room) {
                throw new Error(`Room with id ${roomId} not found`);
            }

            // Lấy lịch sử sử dụng
            const history = await this.roomRepository.getRoomUsageHistory(roomId, startDate, endDate);
            if (!history) {
                return room; // Trả về thông tin phòng nếu không có lịch sử
            }

            // Lọc các lớp học theo thời gian và loại bỏ giáo viên đã xóa
            if (history.classes) {
                history.classes = history.classes
                    .filter(cls => {
                        // Kiểm tra ngày hợp lệ
                        if (!cls.startDate || !cls.endDate) {
                            return false;
                        }

                        // Convert string dates to Date objects if needed
                        const startDateObj = new Date(cls.startDate);
                        const endDateObj = new Date(cls.endDate);

                        // Kiểm tra ngày không hợp lệ (1970-01-01)
                        const invalidDate = new Date('1970-01-01');
                        if (startDateObj.getTime() === invalidDate.getTime() || 
                            endDateObj.getTime() === invalidDate.getTime()) {
                            return false;
                        }

                        // Lọc theo thời gian nếu có
                        if (startDate && endDate) {
                            return startDateObj <= endDate && endDateObj >= startDate;
                        }
                        return true;
                    })
                    .map(cls => {
                        // Lọc giáo viên chưa bị xóa
                        cls.classTeachers = cls.classTeachers.filter(ct => 
                            ct.teacher && !ct.teacher.isDeleted && !ct.isDeleted
                        );
                        return cls;
                    })
                    // Lọc các lớp có ít nhất 1 giáo viên
                    .filter(cls => cls.classTeachers.length > 0)
                    // Giới hạn số lượng kết quả
                    .slice(0, limit);
            }

            return history;
        } catch (error: any) {
            const message = error?.message || 'Unknown error getting room usage history';
            throw new Error(`Error getting room usage history: ${message}`);
        }
    }

    async checkRoomAvailability(roomId: number, startDate: Date, endDate: Date): Promise<boolean> {
        try {
            const room = await this.roomRepository.findOne({ where: { id: roomId } });
            if (!room) {
                throw new Error(`Room with id ${roomId} not found`);
            }

            // Kiểm tra trạng thái phòng
            if (room.status) {
                return false;
            }

            // Kiểm tra lịch sử sử dụng
            const availableRooms = await this.roomRepository.findAvailableRoomsByTimeSlot(
                startDate,
                endDate
            );

            return availableRooms.some(r => r.id === roomId);
        } catch (error: any) {
            const message = error?.message || 'Unknown error checking room availability';
            throw new Error(`Error checking room availability: ${message}`);
        }
    }

    async getAllRooms(): Promise<Room[]> {
        return this.roomRepository.find({
            where: { isDeleted: false },
            relations: ['classes'],
            order: { roomNumber: 'ASC' }
        });
    }

    async importRoomsFromExcel(filePath: string): Promise<any> {
        try {
            // TODO: Implement Excel import logic
            throw new Error('Not implemented');
        } catch (error: any) {
            const message = error?.message || 'Unknown error importing rooms from Excel';
            throw new Error(`Error importing rooms from Excel: ${message}`);
        }
    }

    async deleteRoom(roomId: number): Promise<void> {
        try {
            const room = await this.roomRepository.findOne({ where: { id: roomId } });
            if (!room) {
                throw new Error(`Room with id ${roomId} not found`);
            }

            // Soft delete
            room.isDeleted = true;
            room.deletedAt = new Date();
            await this.roomRepository.save(room);
        } catch (error: any) {
            const message = error?.message || 'Unknown error deleting room';
            throw new Error(`Error deleting room: ${message}`);
        }
    }
} 