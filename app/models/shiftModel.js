const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Shift = sequelize.define(
  'Shift',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    teaching_shift: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
    tableName: 'shifts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

Shift.associate = (models) => {
  Shift.belongsTo(models.Class, {
    foreignKey: 'class_id',
    as: 'class',
  });
  Shift.belongsToMany(models.Schedule, {
    through: models.ScheduleShift,
    foreignKey: 'shift_id',
    otherKey: 'schedule_id',
    as: 'shift_schedule',
  });
};

module.exports = Shift;
