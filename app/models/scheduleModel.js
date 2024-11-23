const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Course = require('./courseModel');
const Shift = require('./shiftModel');
const Classroom = require('./classroomModel');

const Schedule = sequelize.define(
  'Schedule',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    shift_id:{
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    schedule_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    classroom_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: { model: Classroom, key: 'id' },
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'schedules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: false,
  }
);

Schedule.associate = (models) => {
  Schedule.belongsTo(models.Classroom, {
    foreignKey: 'classroom_id',
    as: 'classroom',
  });
  Schedule.belongsToMany(models.Class, {
    through: 'class_schedule',
    foreignKey: 'schedule_id',
    otherKey: 'class_id',
    as: 'classes',
  });
  Schedule.belongsToMany(models.Shift, {
    through: models.ScheduleShift,
    foreignKey: 'schedule_id',
    otherKey: 'shift_id',
    as: 'schedule_shift',
  });
};

module.exports = Schedule;
