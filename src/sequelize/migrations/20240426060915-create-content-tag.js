'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('content_tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    await queryInterface.addIndex('content_tags', ['content_id', 'tag'], { unique: true });
    await queryInterface.addIndex('content_tags', ['tag']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('content_tags');
  },
};
