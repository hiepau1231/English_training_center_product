const sequelize = require('../../config/database');
const Class = require('../models/classModel');
const Schedule = require('../models/scheduleModel');
const Course = require('../models/courseModel');
const Classroom = require('../models/classroomModel');
const Teacher = require('../models/teacherModel');
const Shift = require('../models/shiftModel');
const ClassTeacher = require('../models/classTeacherModel');
const ClassSchedule = require('../models/classScheduleModel');
const TeacherLevel = require('../models/teacher_levelModel');
const Level = require('../models/levelModel');
const ScheduleShift = require('../models/schedule_shiftModel');

const setupAssociations = () => {
  Classroom.hasMany(Schedule, { foreignKey: 'classroom_id', as: 'schedules' });
  Schedule.belongsTo(Classroom, {
    foreignKey: 'classroom_id',
    as: 'classroom',
  });
  Schedule.belongsTo(Shift, { foreignKey: 'shift_id', as: 'shift' });
  Shift.hasMany(Schedule, { foreignKey: 'shift_id', as: 'schedules' });
  Class.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
  Class.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
  Class.belongsToMany(Teacher, {
    through: ClassTeacher,
    foreignKey: 'class_id',
    otherKey: 'teacher_id',
    as: 'Teachers',
  });

  Teacher.belongsToMany(Class, {
    through: ClassTeacher,
    foreignKey: 'teacher_id',
    otherKey: 'class_id',
    as: 'Classes',
  });
  Class.belongsToMany(Schedule, {
    through: ClassSchedule,
    foreignKey: 'class_id',
    otherKey: 'schedule_id',
    as: 'schedules',
  });

  Schedule.belongsToMany(Class, {
    through: ClassSchedule,
    foreignKey: 'schedule_id',
    otherKey: 'class_id',
    as: 'classes',
  });
  Shift.belongsTo(Class, {
    foreignKey: 'class_id',
    as: 'class',
  });
  Class.hasMany(Shift, {
    foreignKey: 'class_id',
    as: 'shifts',
  });
  Teacher.belongsToMany(Level, {
    through: TeacherLevel,
    foreignKey: 'teacher_id',
    otherKey: 'level_id',
    as: 'levels',
  });

  Level.belongsToMany(Teacher, {
    through: TeacherLevel,
    foreignKey: 'level_id',
    otherKey: 'teacher_id',
    as: 'teachers',
  });
  Shift.belongsToMany(Schedule, {
    through: ScheduleShift,
    foreignKey: 'shift_id',
    otherKey: 'schedule_id',
    as: 'shift_schedule',
  });

  Schedule.belongsToMany(Shift, {
    through: ScheduleShift,
    foreignKey: 'schedule_id',
    otherKey: 'shift_id',
    as: 'schedule_shift',
  });
};

setupAssociations();

module.exports = {
  ClassTeacher,
  Class,
  Schedule,
  Course,
  Classroom,
  Teacher,
  Shift,
  ClassSchedule,
  TeacherLevel,
  Level,
  ScheduleShift
};
