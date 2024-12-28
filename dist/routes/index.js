"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomRoutes_1 = __importDefault(require("./roomRoutes"));
const ClassRoute_1 = __importDefault(require("./ClassRoute"));
const classScheduleRoutes_1 = __importDefault(require("./classScheduleRoutes"));
const import_routes_1 = __importDefault(require("./import.routes"));
const router = (0, express_1.Router)();
router.use('/rooms', roomRoutes_1.default);
router.use('/classes', ClassRoute_1.default);
router.use('/schedules', classScheduleRoutes_1.default);
router.use('/import', import_routes_1.default);
exports.default = router;
