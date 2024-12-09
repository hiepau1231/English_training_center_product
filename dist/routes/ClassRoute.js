"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/classRoutes.ts
const express_1 = require("express");
const ClassController_1 = __importDefault(require("../controllers/ClassController"));
const classRouter = (0, express_1.Router)();
const classController = new ClassController_1.default();
classRouter.get('/', (req, res) => classController.getAllClasses(req, res));
// classRouter.get('/:id', (req, res) => classController.getClassById(req, res));
// classRouter.post('/', (req, res) => classController.createClass(req, res));
// classRouter.put('/:id', (req, res) => classController.updateClass(req, res));
// classRouter.delete('/:id', (req, res) => classController.deleteClass(req, res));
exports.default = classRouter;
//# sourceMappingURL=ClassRoute.js.map