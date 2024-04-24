'use strict';
const { ResourceTypes } = require('../enums/resource-types');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resources', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '',
      },
      resource_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: ResourceTypes.text,
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
    await queryInterface.addIndex('resources', ['url'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resources');
  },
};
