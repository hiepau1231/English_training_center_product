// src/routes/classRoutes.ts
import { Router } from 'express';
import ClassController from '../controllers/ClassController';
const classRouter = Router();
const classController = new ClassController();

classRouter.get('/', (req, res) => classController.getAllClasses(req, res));
classRouter.get('/:id', (req, res) => classController.getClassById(req, res));
// classRouter.post('/', (req, res) => classController.createClass(req, res));
// classRouter.put('/:id', (req, res) => classController.updateClass(req, res));
// classRouter.delete('/:id', (req, res) => classController.deleteClass(req, res));

export default classRouter;
