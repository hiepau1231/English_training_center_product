'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('classes', {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      class_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      course_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'courses', // bảng này phải tồn tại
          key: 'id',
        },
      },
      classroom_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'classrooms', // bảng này phải tồn tại
          key: 'id',
        },
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      teachers_role_id: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'teachers_roles', // bảng này phải tồn tại
          key: 'id',
        },
      },
      cm_main: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      cm_sub: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      schedules_id: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'schedules', // bảng này phải tồn tại
          key: 'id',
        },
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('classes');
  },
};