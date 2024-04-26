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
      resource_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      keyword_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    });
    await queryInterface.addIndex('resource_keywords', ['keyword_id', 'resource_id'], { unique: true });
    await queryInterface.addIndex('resource_keywords', ['resource_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resource_keywords');
  },
};
