'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('keywords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // frickr, instagram の他の予定
      service_type: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      // username, searchword, url の予定
      word_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      word: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
    await queryInterface.addIndex('keywords', ['word', 'service_type', 'word_type'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('keywords');
  },
};
