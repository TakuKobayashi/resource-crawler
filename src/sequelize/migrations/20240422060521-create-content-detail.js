'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('content_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      content_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      tags: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.TEXT,
      },
    });
    await queryInterface.addIndex('content_details', ['content_id'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('content_details');
  },
};
