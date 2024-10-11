const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Course = require('./courseModel');
const Shift = require('./shiftModel');
const Classroom = require('./classroomModel');

const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    },
    schedule_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    shift_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: { model: Shift, key: 'id' }
    },
    classroom_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: { model: Classroom, key: 'id' }
    },
    attendance: {
        type: DataTypes.ENUM('Present', 'Absent', 'Late'),
        allowNull: true,
        defaultValue: 'Present'
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    tableName: 'schedules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: false
});

Schedule.associate = (models) => {
    Schedule.belongsTo(models.Class, { foreignKey: 'schedules_id', as: 'class' });
    Schedule.belongsTo(models.Shift, { foreignKey: 'shift_id', as: 'shift' });
    Schedule.belongsTo(models.Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
};

module.exports = Schedule;
