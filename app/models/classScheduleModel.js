const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ClassSchedule = sequelize.define(
  'ClassSchedule',
  {
    class_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id',
      },
    },
    schedule_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'schedules',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE ,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'class_schedules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    
  }
);

module.exports = ClassSchedule;
