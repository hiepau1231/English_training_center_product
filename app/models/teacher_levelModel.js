const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Teacher = require('./teacherModel');
const Level = require('./levelModel');

const TeacherLevel = sequelize.define(
  'TeacherLevel',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    level_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: { model: Level, key: 'id' },
    },
    teacher_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: { model: Teacher, key: 'id' },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'teacher_level',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

module.exports = TeacherLevel;
