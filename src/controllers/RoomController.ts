import { Request, Response } from 'express';
import { ClassroomService } from '../services/ClassroomService';
import { ClassScheduleService } from '../services/ClassScheduleService';
import { AppError } from '../utils/AppError';
import { ClassSchedule } from '../entities/ClassSchedule';
import { ClassScheduleRepository } from '../repositories/ClassScheduleRepository';
import { TeacherRepository } from '../repositories/TeacherRepository';
import { RoomRepository } from '../repositories/RoomRepository';

export class RoomController {
    private classroomService: ClassroomService;
    private classScheduleService: ClassScheduleService;

    constructor() {
        this.classroomService = new ClassroomService();
        const classScheduleRepo = new ClassScheduleRepository();
        const teacherRepo = new TeacherRepository();
        const roomRepo = new RoomRepository();
        this.classScheduleService = new ClassScheduleService(
            classScheduleRepo,
            teacherRepo,
            roomRepo
        );
    }

    // Lấy thông tin chi tiết phòng
    async getRoomDetails(req: Request, res: Response) {
        try {
            const roomId = parseInt(req.params.id);
            if (isNaN(roomId)) {
                throw new AppError('Invalid room ID', 400);
            }
            
            const room = await this.classroomService.getRoomDetails(roomId);
            
            if (!room) {
                throw new AppError('Room not found', 404);
            }

            // Format the response
            const response = {
                success: true,
                data: {
                    room: {
                        id: room.id,
                        roomNumber: room.roomNumber,
                        type: room.type,
                        capacity: room.capacity,
                        status: room.status ? 'Đang sử dụng' : 'Trống',
                        createdAt: room.createdAt,
                        updatedAt: room.updatedAt
                    },
                    classes: (room.classes as any)?.map((cls: any) => ({
                        id: cls.id,
                        className: cls.className,
                        course: cls.course ? {
                            id: cls.course.id,
                            name: cls.course.courseName,
                            level: cls.course.level,
                            status: cls.course.status
                        } : null,
                        startDate: cls.startDate,
                        endDate: cls.endDate,
                        numberOfStudents: cls.numberOfStudents,
                        teachers: cls.classTeachers?.map((ct: any) => ({
                            id: ct.teacher.id,
                            name: ct.teacher.teacherName,
                            role: ct.role,
                            experience: ct.teacher.experience || 'Chưa cập nhật',
                            isForeign: ct.teacher.isForeign ? 'Có' : 'Không',
                            isFulltime: ct.teacher.isFulltime ? 'Có' : 'Không',
                            phoneNumber: ct.teacher.phoneNumber || 'Chưa cập nhật'
                        })) || [],
                        schedules: (cls.schedules || []).map((s: any) => ({
                            id: s.id,
                            date: s.scheduleDate,
                            formattedDate: new Date(s.scheduleDate).toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }),
                            teacher: {
                                id: s.teacherId,
                                name: s.teacherName
                            },
                            shift: {
                                id: s.shiftId,
                                name: s.shiftName
                            }
                        }))
                    })) || []
                }
            };

            res.json(response);
        } catch (error) {
            console.error('Error in getRoomDetails:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ 
                    success: false,
                    message: error.message 
                });
            } else {
                res.status(500).json({ 
                    success: false,
                    message: 'Internal server error',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
    }

    // Tìm kiếm phòng theo nhiều tiêu chí
    async searchRooms(req: Request, res: Response) {
        try {
            const { type, capacity, status, startDate, endDate } = req.query;
            
            const searchOptions: any = {};
            
            if (type) {
                // Không cần decode vì Express đã tự động decode query parameters
                searchOptions.type = type as string;
                console.log('Type before search:', searchOptions.type);
            }
            if (capacity) searchOptions.capacity = parseInt(capacity as string);
            if (status !== undefined) searchOptions.status = status === 'true';
            if (startDate) searchOptions.startDate = new Date(startDate as string);
            if (endDate) searchOptions.endDate = new Date(endDate as string);

            const rooms = await this.classroomService.searchRooms(searchOptions);

            res.json(rooms);
        } catch (error) {
            console.error('Error searching rooms:', error);
            res.status(500).json({ message: 'Error searching rooms' });
        }
    }

    // Cập nhật thông tin phòng
    async updateRoom(req: Request, res: Response) {
        try {
            const roomId = parseInt(req.params.id);
            if (isNaN(roomId)) {
                throw new AppError('Invalid room ID', 400);
            }

            const { roomNumber, capacity, type, status } = req.body;
            if (!roomNumber || !capacity || !type) {
                throw new AppError('Missing required fields', 400);
            }

            const updatedRoom = await this.classroomService.updateRoom(roomId, {
                roomNumber,
                capacity,
                type,
                status
            });

            res.json(updatedRoom);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error updating room:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    // Kiểm tra tình trạng phòng
    async checkRoomAvailability(req: Request, res: Response) {
        try {
            const roomId = parseInt(req.params.id);
            if (isNaN(roomId)) {
                throw new AppError('Invalid room ID', 400);
            }

            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                throw new AppError('Start date and end date are required', 400);
            }

            const isAvailable = await this.classroomService.checkRoomAvailability(
                roomId,
                new Date(startDate as string),
                new Date(endDate as string)
            );

            res.json({ isAvailable });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error checking room availability:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    // Lấy lịch sử sử dụng phòng
    async getRoomHistory(req: Request, res: Response) {
        try {
            const roomId = parseInt(req.params.id);
            if (isNaN(roomId)) {
                throw new AppError('Invalid room ID', 400);
            }

            // Validate dates
            const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
            const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
            }

            if (startDate > endDate) {
                throw new AppError('Start date must be before end date', 400);
            }

            console.log('Getting room history for:', { roomId, startDate, endDate });

            // Get room details and schedules
            const [room, schedules] = await Promise.all([
                this.classroomService.getRoomDetails(roomId),
                this.classScheduleService.findSchedulesByRoom(roomId, startDate, endDate)
            ]);

            console.log('Room details:', room);
            console.log('Schedules:', schedules);

            if (!room) {
                throw new AppError('Room not found', 404);
            }

            // Format the response
            const response = {
                success: true,
                data: {
                    room: {
                        id: room.id,
                        roomNumber: room.roomNumber,
                        type: room.type,
                        capacity: room.capacity,
                        status: room.status ? 'Đang sử dụng' : 'Trống'
                    },
                    schedules: schedules.map(schedule => {
                        // Parse shift time from teachingShift
                        let shiftName = '';
                        let startTime = '';
                        let endTime = '';
                        if (schedule.shift?.teachingShift) {
                            const match = schedule.shift.teachingShift.match(/\(([\d:]+)\s*-\s*([\d:]+)\)/);
                            if (match) {
                                startTime = match[1];
                                endTime = match[2];
                                shiftName = schedule.shift.teachingShift.split('(')[0].trim();
                            } else {
                                shiftName = schedule.shift.teachingShift;
                            }
                        }

                        return {
                            id: schedule.id,
                            date: schedule.scheduleDate,
                            dayOfWeek: new Date(schedule.scheduleDate).toLocaleDateString('vi-VN', { weekday: 'long' }),
                            formattedDate: new Date(schedule.scheduleDate).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }),
                            shift: schedule.shift ? {
                                id: schedule.shift.id,
                                name: shiftName,
                                startTime: startTime,
                                endTime: endTime,
                                teachingShift: schedule.shift.teachingShift
                            } : null,
                            class: schedule.class ? {
                                id: schedule.class.id,
                                name: schedule.class.className,
                                numberOfStudents: schedule.class.numberOfStudents,
                                course: schedule.class.course ? {
                                    id: schedule.class.course.id,
                                    name: schedule.class.course.courseName,
                                    level: schedule.class.course.level
                                } : null
                            } : null,
                            teacher: schedule.teacher ? {
                                id: schedule.teacher.id,
                                name: schedule.teacher.teacherName,
                                level: schedule.teacher.level?.levelName,
                                experience: schedule.teacher.experience || 'Chưa cập nhật'
                            } : null
                        };
                    })
                },
                pagination: {
                    total: schedules.length,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                }
            };

            res.json(response);
        } catch (error) {
            console.error('Error in getRoomHistory:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ 
                    success: false,
                    message: error.message,
                    error: error instanceof Error ? error.stack : undefined
                });
            } else {
                res.status(500).json({ 
                    success: false,
                    message: 'Internal server error',
                    error: error instanceof Error ? error.stack : 'Unknown error'
                });
            }
        }
    }

    async getAllRooms(req: Request, res: Response) {
        try {
            const rooms = await this.classroomService.getAllRooms();
            res.json(rooms);
        } catch (error) {
            console.error('Error getting all rooms:', error);
            res.status(500).json({ message: 'Error getting all rooms' });
        }
    }

    // Upload danh sách phòng t��� Excel
    async uploadRooms(req: Request, res: Response) {
        try {
            if (!req.file) {
                throw new AppError('No file uploaded', 400);
            }

            const result = await this.classroomService.importRoomsFromExcel(req.file.path);
            res.json(result);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error uploading rooms:', error);
                res.status(500).json({ message: 'Error uploading rooms' });
            }
        }
    }

    // Xóa phòng
    async deleteRoom(req: Request, res: Response) {
        try {
            const roomId = parseInt(req.params.id);
            if (isNaN(roomId)) {
                throw new AppError('Invalid room ID', 400);
            }

            await this.classroomService.deleteRoom(roomId);
            res.json({ message: 'Room deleted successfully' });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error deleting room:', error);
                res.status(500).json({ message: 'Error deleting room' });
            }
        }
    }

    // Test endpoint to insert test schedules
    async insertTestSchedules(req: Request, res: Response) {
        try {
            const classScheduleRepo = new ClassScheduleRepository();
            await classScheduleRepo.insertTestSchedules();
            res.json({ success: true, message: 'Test schedules inserted successfully' });
        } catch (error) {
            console.error('Error inserting test schedules:', error);
            res.status(500).json({ 
                success: false,
                message: 'Failed to insert test schedules',
                error: error instanceof Error ? error.stack : 'Unknown error'
            });
        }
    }
} 