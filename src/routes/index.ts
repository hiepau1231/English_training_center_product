import { Router } from 'express';
import classRouter from './ClassRoute';
const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Example Route!' });
  });
  router.use('/classes', classRouter);
export default router;
