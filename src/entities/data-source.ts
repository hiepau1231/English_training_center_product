import "reflect-metadata";
import { DataSource } from "typeorm";
import { Class } from './Class';
import { Classroom } from './classroomEntity';
import { ClassSchedule } from './classScheduleEntity';
import { ClassTeacher } from './classTeacherEntity';
import { Course } from './courseEntity';
import { Level } from './levelEntity';
import { Schedule } from './scheduleEntity';
import { ScheduleShift } from './scheduleShiftEntity';
import { Shift } from './shiftEntity';
import { Teacher } from './teacherEntity';
import { TeacherLevel } from './teacherLevelEntity';

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "english_center",
  synchronize: false,
  logging: true,
  entities: [
    Class,
    Schedule,
    Course,
    Teacher,
    Classroom,
    Shift,
    ClassTeacher,
    ClassSchedule,
    TeacherLevel,
    Level,
    ScheduleShift
  ],
  migrations: [],
  subscribers: [],
});
