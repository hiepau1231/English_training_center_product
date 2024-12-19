import { Router } from 'express';
import { ClassScheduleController } from '../controllers/ClassScheduleController';
import { validateRequest } from '../middleware/validateRequest';
import { 
    replaceTeacherSchema, 
    replaceRoomSchema, 
    rescheduleClassSchema 
} from '../validations/classScheduleValidation';
import { catchAsync } from '../utils/AppError';

const router = Router();
const classScheduleController = new ClassScheduleController();

// Get daily schedules
router.get('/daily', catchAsync(classScheduleController.getDailySchedules));

// Get schedule details
router.get('/:id', catchAsync(classScheduleController.getScheduleDetails));

// Replace teacher
router.put('/:id/replace-teacher', 
    validateRequest(replaceTeacherSchema),
    catchAsync(classScheduleController.replaceTeacher)
);

// Replace room
router.put('/:id/replace-room', 
    validateRequest(replaceRoomSchema),
    catchAsync(classScheduleController.replaceRoom)
);

// Reschedule class
router.put('/:id/reschedule', 
    validateRequest(rescheduleClassSchema),
    catchAsync(classScheduleController.rescheduleClass)
);

// Find available replacement teachers
router.get('/:id/available-teachers', 
    catchAsync(classScheduleController.findAvailableTeachers)
);

// Find available replacement rooms
router.get('/available-rooms', 
    catchAsync(classScheduleController.findAvailableRooms)
);

export default router; 