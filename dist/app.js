"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const classScheduleRoutes_1 = __importDefault(require("./routes/classScheduleRoutes"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const import_routes_1 = __importDefault(require("./routes/import.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/class-schedules', classScheduleRoutes_1.default);
app.use('/api/rooms', roomRoutes_1.default);
app.use('/api/import', import_routes_1.default);
exports.default = app;
