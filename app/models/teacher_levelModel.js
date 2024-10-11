const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');


  const TeacherLevel = sequelize.define('TeacherLevel', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    level_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    teacher_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: { model: teachers, key: 'id'}
    }
  }, {
    tableName: 'teacher_level',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    // paranoid: true
  });

  module.exports = TeacherLevel;
