import { DataSource } from "typeorm";
import { TeacherLevel } from "./entities/TeacherLevel";
import { Teacher } from "./entities/Teacher";
import { Room } from "./entities/Room";
import { Course } from "./entities/Course";
import { Class } from "./entities/Class";
import { ClassTeacher } from "./entities/ClassTeacher";
import { ClassSchedule } from "./entities/ClassSchedule";
import { Shift } from "./entities/Shift";
import dotenv from 'dotenv';
import { AddTimeToShift1703000000001 } from "./migrations/AddTimeToShift";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_DATABASE || "english_tranning_center",
    synchronize: false,
    logging: true,
    entities: [
        TeacherLevel,
        Teacher,
        Room,
        Course,
        Class,
        ClassTeacher,
        ClassSchedule,
        Shift
    ],
    migrations: [AddTimeToShift1703000000001],
    subscribers: [],
}); 