import { Router } from 'express';
import ClassController from '../controllers/ClassController';
import asyncHandler from '../middlewares/asyncHandler';

const classRouter = Router();
const classController = new ClassController();

classRouter.get('/', asyncHandler((req, res) => classController.getAllClasses(req, res)));
classRouter.get('/:id', asyncHandler((req, res) => classController.getClassById(req, res)));
classRouter.post('/', asyncHandler((req, res) => classController.createClass(req, res)));
classRouter.put('/:id', asyncHandler((req, res) => classController.updateClass(req, res)));
classRouter.patch('/:id', asyncHandler((req, res) => classController.deleteClass(req, res)));

export default classRouter;
