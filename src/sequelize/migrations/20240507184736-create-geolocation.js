'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('geolocations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      source_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      source_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      geohash: {
        type: Sequelize.STRING,
      },
    });
    await queryInterface.addIndex('geolocations', ['source_type', 'source_id']);
    await queryInterface.addIndex('geolocations', ['geohash']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('geolocations');
  },
};
