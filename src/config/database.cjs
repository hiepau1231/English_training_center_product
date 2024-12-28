const path = require('path');
require('reflect-metadata');
const { DataSource } = require('typeorm');
const { Teacher } = require('../entities/Teacher.ts');
const { TeacherLevel } = require('../entities/TeacherLevel.ts');
const { Room } = require('../entities/Room.ts');
const { Course } = require('../entities/Course.ts');
const { ClassSchedule } = require('../entities/ClassSchedule.ts');
const { Class } = require('../entities/Class.ts');
const { ClassTeacher } = require('../entities/ClassTeacher.ts');
const { Shift } = require('../entities/Shift.ts');
require('dotenv').config();

module.exports = new DataSource({
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
    ClassSchedule,
    Class,
    ClassTeacher,
    Shift
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
