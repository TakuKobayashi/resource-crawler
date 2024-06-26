'use strict';

const { ServiceTypes } = require('../enums/service-types');
const { WordTypes } = require('../enums/word-types');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('keywords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      service_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: ServiceTypes.unknown,
      },
      word_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: WordTypes.url,
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
