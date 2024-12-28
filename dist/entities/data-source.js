"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Class_1 = require("./Class");
const classroomEntity_1 = require("./classroomEntity");
const classScheduleEntity_1 = require("./classScheduleEntity");
const classTeacherEntity_1 = require("./classTeacherEntity");
const courseEntity_1 = require("./courseEntity");
const levelEntity_1 = require("./levelEntity");
const scheduleEntity_1 = require("./scheduleEntity");
const scheduleShiftEntity_1 = require("./scheduleShiftEntity");
const shiftEntity_1 = require("./shiftEntity");
const teacherEntity_1 = require("./teacherEntity");
const teacherLevelEntity_1 = require("./teacherLevelEntity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "english_center",
    synchronize: false,
    logging: true,
    entities: [
        Class_1.Class,
        scheduleEntity_1.Schedule,
        courseEntity_1.Course,
        teacherEntity_1.Teacher,
        classroomEntity_1.Classroom,
        shiftEntity_1.Shift,
        classTeacherEntity_1.ClassTeacher,
        classScheduleEntity_1.ClassSchedule,
        teacherLevelEntity_1.TeacherLevel,
        levelEntity_1.Level,
        scheduleShiftEntity_1.ScheduleShift
    ],
    migrations: [],
    subscribers: [],
});
