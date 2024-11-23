const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Course = sequelize.define(
  'Course',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    course_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'completed'),
      allowNull: true,
      defaultValue: 'active',
    },
    level: {
      type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
      allowNull: false,
      defaultValue: 'Beginner',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'courses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    // paranoid: true
  }
);
Course.associate = (models) => {
  Course.hasMany(models.Class, { foreignKey: 'course_id', as: 'classes' });
};

module.exports = Course;
