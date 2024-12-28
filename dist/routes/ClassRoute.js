"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClassController_1 = __importDefault(require("../controllers/ClassController"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const classRouter = (0, express_1.Router)();
const classController = new ClassController_1.default();
classRouter.get('/schedules/daily', (0, asyncHandler_1.default)((req, res) => classController.getDailySchedules(req, res)));
classRouter.get('/', (0, asyncHandler_1.default)((req, res) => classController.getAllClasses(req, res)));
classRouter.post('/', (0, asyncHandler_1.default)((req, res) => classController.createClass(req, res)));
classRouter.get('/:id', (0, asyncHandler_1.default)((req, res) => classController.getClassById(req, res)));
classRouter.put('/:id', (0, asyncHandler_1.default)((req, res) => classController.updateClass(req, res)));
classRouter.patch('/:id', (0, asyncHandler_1.default)((req, res) => classController.deleteClass(req, res)));
exports.default = classRouter;
