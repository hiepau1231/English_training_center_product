const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Course = require('./courseModel');
const Classroom = require('./classroomModel');

const Schedule = require('./scheduleModel');

const Class = sequelize.define(
  'Class',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    class_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: { model: Course, key: 'id' },
    },
    classroom_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: { model: Classroom, key: 'id' },
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'classes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);
Class.associate = (models) => {
  Class.hasMany(models.Schedule, {
    foreignKey: 'schedules_id',
    as: 'schedules',
  });
  Class.belongsTo(models.Classroom, {
    foreignKey: 'classroom_id',
    as: 'classroom',
  });
  Class.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
  Class.belongsToMany(models.Teacher, {
    through: models.ClassTeacher,
    foreignKey: 'class_id',
    otherKey: 'teacher_id',
    as: 'Teachers',
  });
  Class.belongsToMany(models.Schedule, {
    through: models.ClassSchedule,
    foreignKey: 'class_id',
    otherKey: 'schedule_id',
    as: 'schedules',
  });
  Class.hasMany(models.Shift, {
    foreignKey: 'class_id',
    as: 'shifts',
  });
};

module.exports = Class;
