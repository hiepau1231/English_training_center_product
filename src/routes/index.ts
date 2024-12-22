import { Router } from 'express';
import roomRoutes from './roomRoutes';
import classRoutes from './ClassRoute';
import classScheduleRoutes from './classScheduleRoutes';
import importRoutes from './import.routes';

const router = Router();

router.use('/rooms', roomRoutes);
router.use('/classes', classRoutes);
router.use('/schedules', classScheduleRoutes);
router.use('/import', importRoutes);

export default router;
