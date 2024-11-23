const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Class = require('./classModel');

const Classroom = sequelize.define(
  'Classroom',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    classroom_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'Phòng Nghe Nhìn',
        'Phòng Trực Tuyến',
        'Phòng Online',
        'Phòng cho trẻ'
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull:false,
      defaultValue:0,
    },
    capacity: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
  },
  {
    tableName: 'classrooms',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    // paranoid: true
  }
);
Classroom.associate = (models) => {
  Classroom.hasMany(models.Class, { foreignKey: 'classroom_id', as: 'class' });
  Classroom.hasMany(models.Schedule, {
    foreignKey: 'classroom_id',
    as: 'schedules',
  });
};
module.exports = Classroom;
