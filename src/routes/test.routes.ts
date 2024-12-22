import { Router } from 'express';
import { RoomRepository } from '../repositories/RoomRepository';
import { ClassTeacherRepository } from '../repositories/ClassTeacherRepository';
import { ScheduleRepository } from '../repositories/ScheduleRepository';
import { ClassroomService } from '../services/ClassroomService';
import { ImportService } from '../services/ImportService';
import multer from 'multer';
import { AppDataSource } from '../data-source';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Test RoomRepository
router.get('/rooms', async (req, res) => {
    try {
        const roomRepo = new RoomRepository();
        const rooms = await roomRepo.findRoomsByMultipleCriteria({
            type: req.query.type as string,
            capacity: req.query.capacity ? parseInt(req.query.capacity as string) : undefined,
            status: req.query.status === 'true'
        });
        res.json(rooms);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error finding rooms',
            error: error?.message || 'Unknown error'
        });
    }
});

// Test ClassTeacherRepository
router.get('/teachers/by-room/:roomId', async (req, res) => {
    try {
        const classTeacherRepo = new ClassTeacherRepository();
        const teachers = await classTeacherRepo.findTeachersByRoom(parseInt(req.params.roomId));
        res.json(teachers);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error finding teachers',
            error: error?.message || 'Unknown error'
        });
    }
});

// Test ScheduleRepository
router.get('/schedules/by-room/:roomId', async (req, res) => {
    try {
        const scheduleRepo = new ScheduleRepository();
        const schedules = await scheduleRepo.findSchedulesByRoom(
            parseInt(req.params.roomId),
            req.query.startDate ? new Date(req.query.startDate as string) : undefined,
            req.query.endDate ? new Date(req.query.endDate as string) : undefined
        );
        res.json(schedules);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error finding schedules',
            error: error?.message || 'Unknown error'
        });
    }
});

// Test ClassroomService
router.get('/services/rooms', async (req, res) => {
    try {
        const classroomService = new ClassroomService();
        const rooms = await classroomService.searchRooms({
            type: req.query.type as string,
            capacity: req.query.capacity ? parseInt(req.query.capacity as string) : undefined,
            status: req.query.status === 'true',
            startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
            endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
        });
        res.json(rooms);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error searching rooms',
            error: error?.message || 'Unknown error'
        });
    }
});

router.get('/services/rooms/:id', async (req, res) => {
    try {
        const classroomService = new ClassroomService();
        const room = await classroomService.getRoomDetails(parseInt(req.params.id));
        res.json(room);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error getting room details',
            error: error?.message || 'Unknown error'
        });
    }
});

router.put('/services/rooms/:id', async (req, res) => {
    try {
        const classroomService = new ClassroomService();
        const room = await classroomService.updateRoom(parseInt(req.params.id), {
            roomNumber: req.body.roomNumber,
            capacity: req.body.capacity,
            type: req.body.type,
            status: req.body.status
        });
        res.json(room);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error updating room',
            error: error?.message || 'Unknown error'
        });
    }
});

router.get('/services/rooms/:id/availability', async (req, res) => {
    try {
        const classroomService = new ClassroomService();
        const isAvailable = await classroomService.checkRoomAvailability(
            parseInt(req.params.id),
            new Date(req.query.startDate as string),
            new Date(req.query.endDate as string)
        );
        res.json({ isAvailable });
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error checking room availability',
            error: error?.message || 'Unknown error'
        });
    }
});

// Test ImportService
router.post('/services/import/rooms', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const importService = new ImportService();
        const result = await importService.importRoomsFromExcel(req.file.buffer);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error importing rooms',
            error: error?.message || 'Unknown error'
        });
    }
});

router.post('/services/import/teachers', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const importService = new ImportService();
        const result = await importService.importTeachersFromExcel(req.file.buffer);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error importing teachers',
            error: error?.message || 'Unknown error'
        });
    }
});

export default router; 