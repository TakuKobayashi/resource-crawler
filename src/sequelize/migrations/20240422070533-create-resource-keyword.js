'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resource_keywords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      resource_uuid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      keyword_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    });
    await queryInterface.addIndex('resource_keywords', ['resource_uuid']);
    await queryInterface.addIndex('resource_keywords', ['keyword_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resource_keywords');
  },
};
