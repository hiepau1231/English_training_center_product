"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const path_1 = __importDefault(require("path"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Teacher_1 = require("../entities/Teacher");
const TeacherLevel_1 = require("../entities/TeacherLevel");
const Room_1 = require("../entities/Room");
const Course_1 = require("../entities/Course");
const ClassSchedule_1 = require("../entities/ClassSchedule");
const dotenv_1 = __importDefault(require("dotenv"));
// Load .env file
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [
        Teacher_1.Teacher,
        TeacherLevel_1.TeacherLevel,
        Room_1.Room,
        Course_1.Course,
        ClassSchedule_1.ClassSchedule
    ],
    migrations: [
        path_1.default.join(__dirname, '/../migrations/*ts'),
    ],
    charset: 'utf8mb4',
    timezone: '+07:00',
    supportBigNumbers: true,
    bigNumberStrings: false,
    extra: {
        connectionLimit: 10
    }
});
