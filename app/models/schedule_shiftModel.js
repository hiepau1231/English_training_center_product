const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ScheduleShift = sequelize.define(
  'ScheduleShift',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    schedule_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'schedules',
        key: 'id',
      },
    },
    shift_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'shifts',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
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
    },
  },
  {
    tableName: 'schedule_shifts',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

// // Định nghĩa quan hệ
// ScheduleShift.associate = (models) => {
//   ScheduleShift.belongsTo(models.Schedule, {
//     foreignKey: 'schedule_id',
//     as: 'schedule',
//   });
//   ScheduleShift.belongsTo(models.Shift, {
//     foreignKey: 'shift_id',
//     as: 'shift',
//   });
// };

module.exports = ScheduleShift;