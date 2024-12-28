import { Router } from 'express';
import { ClassScheduleController } from '../controllers/ClassScheduleController';

const router = Router();
const classScheduleController = new ClassScheduleController();

// Get all schedules
router.get('/', classScheduleController.getAllSchedules.bind(classScheduleController));

// Xem lịch dạy trong ngày
router.get('/daily', async (req, res) => {
    try {
        const dateStr = req.query.date as string;
        if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }
        
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date'
            });
        }

        const schedules = await classScheduleController.getDailySchedules(req, res);
        return schedules;
    } catch (error) {
        console.error('Error in daily schedules route:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Xem chi tiết lịch học
router.get('/:id', classScheduleController.getScheduleDetails.bind(classScheduleController));

// Thay thế giáo viên
router.put('/:id/replace-teacher', classScheduleController.replaceTeacher.bind(classScheduleController));

// Thay đổi phòng học
router.put('/:id/replace-room', classScheduleController.replaceRoom.bind(classScheduleController));

// Thay đổi thời gian học
router.put('/:id/reschedule', classScheduleController.rescheduleClass.bind(classScheduleController));

// Tìm giáo viên có thể thay thế
router.get('/:id/available-teachers', classScheduleController.findAvailableTeachers.bind(classScheduleController));

// Tạo lịch học tự động
router.post('/generate', classScheduleController.generateSchedules.bind(classScheduleController));

// Kiểm tra xung đột lịch học
router.get('/conflicts', classScheduleController.checkConflicts.bind(classScheduleController));

// Giải quyết xung đột lịch học
router.post('/resolve-conflicts', classScheduleController.resolveConflicts.bind(classScheduleController));

// Xem thống kê lịch học
router.get('/statistics', classScheduleController.getStatistics.bind(classScheduleController));

export default router;
