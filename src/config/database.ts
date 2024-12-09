import path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Class } from '../entities/classEntity';
import { Classroom } from '../entities/classroomEntity';
import { ClassSchedule } from '../entities/classScheduleEntity';
import { ClassTeacher } from '../entities/classTeacherEntity';
import { Course } from '../entities/courseEntity';
import { Level } from '../entities/levelEntity';
import { Schedule } from '../entities/scheduleEntity';
import { ScheduleShift } from '../entities/scheduleShiftEntity';
import { Shift } from '../entities/shiftEntity';
import { Teacher } from '../entities/teacherEntity';
import { TeacherLevel } from '../entities/teacherLevelEntity';
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'english_tranning_center',
  synchronize: false,
  logging: true,
  entities: [
    // path.join(__dirname, "entities/*.{ts,js}"),
    Class,
    ClassSchedule,
    Schedule,
    ScheduleShift,
    Shift,
    Classroom,
    ClassTeacher,
    Course,
    Level,
    Teacher,
    TeacherLevel,
  ],
  migrations: [
    path.join(__dirname, '/../migrations/*ts'),
  ],
});
