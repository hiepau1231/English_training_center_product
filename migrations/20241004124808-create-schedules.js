'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('schedules', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            schedule_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            shift_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'shifts',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            classroom_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'classrooms',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            attendance: {
                type: Sequelize.ENUM('Present', 'Absent', 'Late'),
                allowNull: true,
            },
            schedules_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'classes',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            class_fk: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'classes',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('schedules');
    },
};