const sequelize = require('../../config/database');
const Class = require('../models/classModel');
const Schedule = require('../models/scheduleModel');
const Course = require('../models/courseModel');
const Classroom = require('../models/classroomModel');
const Teacher = require('../models/teacherModel');
const Shift = require('../models/shiftModel');
const TeachersRole = require('../models/teacher_roleModel');

const setupAssociations = () => {
    Class.hasMany(Schedule, { foreignKey: 'schedules_id', as: 'schedules' });
    Schedule.belongsTo(Class, { foreignKey: 'schedules_id', as: 'class' });
    Classroom.hasMany(Schedule, { foreignKey: 'classroom_id', as: 'schedules' });
    Schedule.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
    Schedule.belongsTo(Shift, { foreignKey: 'shift_id', as: 'shift' });
    Shift.hasMany(Schedule, { foreignKey: 'shift_id', as: 'schedules' });
    Class.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
    Class.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
    Class.belongsTo(Teacher, { as: 'MainTeacher', foreignKey: 'cm_main' });
    Class.belongsTo(Teacher, { as: 'SubTeacher', foreignKey: 'cm_sub' });
};

setupAssociations();

// const syncDatabase = async () => {
//     try {
//         await sequelize.sync({ alter: false });
//         console.log('Database synchronized successfully.');
//     } catch (err) {
//         console.error('Error synchronizing the database:', err);
//     }
// };

// syncDatabase();

module.exports = {
    Class,
    Schedule,
    Course,
    Classroom,
    Teacher,
    Shift,
    TeachersRole
};