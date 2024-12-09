"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const classEntity_1 = require("./classEntity");
// import { Classroom } from './classroomEntity';
// import { ClassSchedule } from './classScheduleEntity';
// import { ClassTeacher } from './classTeacherEntity';
// import { Course } from './courseEntity';
// import { Level } from './levelEntity';
// import { Schedule } from './scheduleEntity';
// import { ScheduleShift } from './scheduleShiftEntity';
// import { Shift } from './shiftEntity';
// import { Teacher } from './teacherEntity';
// import { TeacherLevel } from './teacherLevelEntity';
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
        classEntity_1.Class,
        // Schedule,
        // Course,
        // Teacher,
        // Classroom,
        // Shift,
        // ClassTeacher,
        // ClassSchedule,
        // TeacherLevel,
        // Level,
        // ScheduleShift
    ],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map