
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Course = require('./courseModel');
const Classroom = require('./classroomModel');
const TeachersRole = require('./teacher_roleModel');
const Teacher = require('./teacherModel');
const Schedule = require('./scheduleModel');

const Class = sequelize.define('Class', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    class_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    course_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: { model: Course, key: 'id' }
    },
    classroom_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: { model: Classroom, key: 'id' }
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    teachers_role_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: { model: TeachersRole, key: 'id' }
    },
    cm_main: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    cm_sub: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    schedules_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: { model: Schedule, key: 'id' }
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull:true
    }
}, {
    tableName: 'classes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    // paranoid: true
});

Class.associate = (models) => {
    Class.hasMany(models.Schedule, { foreignKey: 'schedules_id', as: 'schedules' });
    Class.belongsTo(models.Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
    Class.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
    Class.belongsTo(models.Teacher, { foreignKey: 'cm_main', as: 'MainTeacher' });
    Class.belongsTo(models.Teacher, { foreignKey: 'cm_sub', as: 'SubTeacher' });
};

module.exports = Class;


    