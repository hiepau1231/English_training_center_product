import express from 'express';
import { uploadFile } from '../middleware/uploadFile';
import { importClassSchedules, getRoomTemplate } from '../controllers/ImportController';

const router = express.Router();

router.post('/class-schedules', uploadFile.single('file'), importClassSchedules);
router.get('/templates/room', getRoomTemplate);

export default router;
