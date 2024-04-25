'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resource_contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      resource_uuid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content_uuid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    await queryInterface.addIndex('resource_contents', ['resource_uuid']);
    await queryInterface.addIndex('resource_contents', ['content_uuid']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resource_contents');
  },
};
