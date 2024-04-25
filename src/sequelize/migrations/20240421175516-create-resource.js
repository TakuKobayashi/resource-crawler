'use strict';
const { ResourceTypes } = require('../enums/resource-types');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
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
