'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resource_contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resource_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      content_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
    });
    await queryInterface.addIndex('resource_contents', ['resource_id']);
    await queryInterface.addIndex('resource_contents', ['content_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resource_contents');
  }
};