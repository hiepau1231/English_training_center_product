const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  teacher_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  is_foreign: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  is_Fulltime: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  is_Parttime: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  working_type_id: {
    type: DataTypes.INTEGER(11),
    allowNull: true
  },
  courses_level_id: {
    type: DataTypes.INTEGER(11),
    allowNull: true
  }
}, {
  tableName: 'teachers',
  paranoid: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});
Teacher.associate = (models) => {
  Teacher.hasMany(models.Class, { foreignKey: 'cm_main', as: 'MainClasses' });
  Teacher.hasMany(models.Class, { foreignKey: 'cm_sub', as: 'SubClasses' });
};
// Teacher.hasMany(Class, { foreignKey: 'cm_main', as: 'MainTeacherClasses' });
// Teacher.hasMany(Class, { foreignKey: 'cm_sub', as: 'SubTeacherClasses' });

module.exports = Teacher;
