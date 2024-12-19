import { Request, Response } from 'express';
import { ClassScheduleService } from '../services/ClassScheduleService';
import { ClassScheduleRepository } from '../repositories/ClassScheduleRepository';
import { TeacherRepository } from '../repositories/TeacherRepository';
import { RoomRepository } from '../repositories/RoomRepository';
import { AppError } from '../utils/AppError';

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
            const date = new Date(req.query.date as string);
            const schedules = await this.classScheduleService.getDailySchedules(date);
            res.json(schedules);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
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
            const { date, startTime, endTime, minCapacity } = req.body;
            const rooms = await this.classScheduleService.findAvailableReplacementRooms(
                new Date(date),
                startTime,
                endTime,
                minCapacity
            );
            res.json(rooms);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
} 