const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');


  const Shift = sequelize.define('Shift', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    teaching_shift: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'shifts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    // paranoid: true
  });
  
  Shift.associate = (models) => {
    Shift.hasMany(models.Schedule, { foreignKey: 'shift_id', as: 'schedules' });
};

  module.exports = Shift;
