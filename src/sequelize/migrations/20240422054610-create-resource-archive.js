'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resource_archives', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      resource_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      save_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resource_hash: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex('resource_archives', ['resource_id'], { unique: true });
    await queryInterface.addIndex('resource_archives', ['resource_hash']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resource_archives');
  },
};
