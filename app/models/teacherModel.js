const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Teacher = sequelize.define(
  'Teacher',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    teacher_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_foreign: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
    is_Fulltime: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
    is_Parttime: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    working_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    courses_level_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
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
    tableName: 'teachers',
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);
Teacher.associate = (models) => {
  Teacher.belongsToMany(models.Class, {
    through: 'class_teachers',
    foreignKey: 'teacher_id',
    otherKey: 'class_id',
    as: 'Classes',
  });
  Teacher.belongsToMany(models.Level, {
    through: models.TeacherLevel,
    foreignKey: 'teacher_id',
    otherKey: 'level_id',
    as: 'levels',
  });
};

module.exports = Teacher;
