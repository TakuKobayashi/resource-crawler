'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '',
      },
      content_id: {
        type: Sequelize.INTEGER,
      },
      resource_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
    await queryInterface.addIndex('resources', ['url'], { unique: true });
    await queryInterface.addIndex('resources', ['content_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resources');
  },
};
