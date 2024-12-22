import path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Teacher } from '../entities/Teacher';
import { TeacherLevel } from '../entities/TeacherLevel';
import { Room } from '../entities/Room';
import { Course } from '../entities/Course';
import { ClassSchedule } from '../entities/ClassSchedule';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [
    Teacher,
    TeacherLevel,
    Room,
    Course,
    ClassSchedule
  ],
  migrations: [
    path.join(__dirname, '/../migrations/*ts'),
  ],
  charset: 'utf8mb4',
  timezone: '+07:00',
  supportBigNumbers: true,
  bigNumberStrings: false,
  extra: {
    connectionLimit: 10
  }
});
