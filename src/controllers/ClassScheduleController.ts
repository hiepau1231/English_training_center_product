import { Request, Response } from 'express';
import { ClassScheduleService } from '../services/ClassScheduleService';
import { ClassScheduleRepository } from '../repositories/ClassScheduleRepository';
import { TeacherRepository } from '../repositories/TeacherRepository';
import { RoomRepository } from '../repositories/RoomRepository';
import { AppError } from '../utils/AppError';
import { AppDataSource } from '../data-source';
import { Class, ClassSchedule, Shift } from '../entities';
import { Between, IsNull } from 'typeorm';

export class ClassScheduleController {
    private classScheduleService: ClassScheduleService;

    constructor() {
        const classScheduleRepo = new ClassScheduleRepository();
        const teacherRepo = new TeacherRepository();
        const roomRepo = new RoomRepository();
        this.classScheduleService = new ClassScheduleService(
            classScheduleRepo,
            teacherRepo,
            roomRepo
        );
    }

    async getDailySchedules(req: Request, res: Response) {
        try {
            const dateStr = req.query.date as string;
            if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
            }
            
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                throw new AppError('Invalid date', 400);
            }

            const schedules = await this.classScheduleService.getDailySchedules(date);
            res.json(schedules);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async getScheduleDetails(req: Request, res: Response) {
        try {
            const scheduleId = parseInt(req.params.id);
            const schedule = await this.classScheduleService.getScheduleDetails(scheduleId);
            res.json(schedule);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async replaceTeacher(req: Request, res: Response) {
        try {
            const scheduleId = parseInt(req.params.id);
            const { newTeacherId } = req.body;
            const updatedSchedule = await this.classScheduleService.replaceTeacher(
                scheduleId,
                newTeacherId
            );
            res.json(updatedSchedule);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async replaceRoom(req: Request, res: Response) {
        try {
            const scheduleId = parseInt(req.params.id);
            const { newRoomId } = req.body;
            const updatedSchedule = await this.classScheduleService.replaceRoom(
                scheduleId,
                newRoomId
            );
            res.json(updatedSchedule);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async rescheduleClass(req: Request, res: Response) {
        try {
            const scheduleId = parseInt(req.params.id);
            const { startTime, endTime } = req.body;
            const updatedSchedule = await this.classScheduleService.rescheduleClass(
                scheduleId,
                startTime,
                endTime
            );
            res.json(updatedSchedule);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async findAvailableTeachers(req: Request, res: Response) {
        try {
            const scheduleId = parseInt(req.params.id);
            const { date, startTime, endTime } = req.body;
            const teachers = await this.classScheduleService.findAvailableReplacementTeachers(
                scheduleId,
                new Date(date),
                startTime,
                endTime
            );
            res.json(teachers);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async findAvailableRooms(req: Request, res: Response) {
        try {
            const dateStr = req.query.date as string;
            if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
            }
            
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                throw new AppError('Invalid date', 400);
            }

            const startTime = req.query.startTime as string;
            const endTime = req.query.endTime as string;
            
            if (!startTime || !endTime || 
                !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime) || 
                !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(endTime)) {
                throw new AppError('Invalid time format. Use HH:mm', 400);
            }

            if (startTime >= endTime) {
                throw new AppError('End time must be after start time', 400);
            }

            const minCapacity = parseInt(req.query.minCapacity as string) || 0;
            if (minCapacity < 0) {
                throw new AppError('Minimum capacity cannot be negative', 400);
            }

            const rooms = await this.classScheduleService.findAvailableReplacementRooms(
                date,
                startTime,
                endTime,
                minCapacity
            );
            res.json({ availableRooms: rooms });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error in findAvailableRooms:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async generateSchedules(req: Request, res: Response) {
        try {
            const schedules = await this.classScheduleService.generateSchedules(req.body);
            res.status(200).json({
                status: 'success',
                data: schedules
            });
        } catch (error) {
            throw new AppError('Failed to generate schedules', 500);
        }
    }

    async checkConflicts(req: Request, res: Response) {
        try {
            const conflicts = await this.classScheduleService.checkConflicts();
            res.status(200).json({
                status: 'success',
                data: conflicts
            });
        } catch (error) {
            throw new AppError('Failed to check conflicts', 500);
        }
    }

    async resolveConflicts(req: Request, res: Response) {
        try {
            const result = await this.classScheduleService.resolveConflicts(req.body);
            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            throw new AppError('Failed to resolve conflicts', 500);
        }
    }

    async getStatistics(req: Request, res: Response) {
        try {
            const stats = await this.classScheduleService.getStatistics();
            res.status(200).json({
                status: 'success',
                data: stats
            });
        } catch (error) {
            throw new AppError('Failed to get statistics', 500);
        }
    }
} 