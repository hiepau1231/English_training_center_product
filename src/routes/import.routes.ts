import { Router } from 'express';
import { ImportController } from '../controllers/ImportController';
import multer from 'multer';

const router = Router();
const importController = new ImportController();
const upload = multer({ storage: multer.memoryStorage() });

// Upload và import danh sách phòng học
router.post('/rooms', upload.single('file'), importController.importRooms.bind(importController));

// Upload và import danh sách giáo viên
router.post('/teachers', upload.single('file'), importController.importTeachers.bind(importController));

// Tải file mẫu cho import phòng học
router.get('/templates/room', importController.generateRoomTemplate.bind(importController));

// Tải file mẫu cho import giáo viên
router.get('/templates/teacher', importController.generateTeacherTemplate.bind(importController));

export default router; 