'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resource_contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
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
    await queryInterface.addIndex('resource_contents', ['content_id', 'resource_id'], { unique: true });
    await queryInterface.addIndex('resource_contents', ['resource_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resource_contents');
  },
};
