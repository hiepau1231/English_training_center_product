'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('classrooms', {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      classroom_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('Phòng Nghe Nhìn', 'Phòng Trực Tuyến', 'Phòng Online', 'Phòng cho trẻ'),
        allowNull: false,
      },
      capacity: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('classrooms');
  },
};