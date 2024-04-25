'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      service_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      website_url: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      service_content_id: {
        type: Sequelize.STRING,
      },
      service_user_id: {
        type: Sequelize.STRING,
      },
      service_user_name: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.FLOAT,
      },
      longitude: {
        type: Sequelize.FLOAT,
      },
    });
    await queryInterface.addIndex('contents', ['website_url'], { unique: true });
    await queryInterface.addIndex('contents', ['service_content_id', 'service_type']);
    await queryInterface.addIndex('contents', ['service_user_id', 'service_type']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contents');
  },
};
