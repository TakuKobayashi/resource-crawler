'use strict';
const { ServiceTypes } = require('../enums/service-types');
const { WordTypes } = require('../enums/word-types');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scrapers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // frickr, instagram の他の予定
      service_type: {
        type: Sequelize.INTEGER,
        defaultValue: ServiceTypes.unknown,
      },
      // username, searchword, url の予定
      word_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: WordTypes.url,
      },
      last_keyword_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      last_request_url: {
        type: Sequelize.TEXT,
      },
      last_request_params: {
        type: Sequelize.TEXT,
      },
      executed_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex('scrapers', ['service_type', 'word_type']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('scrapers');
  },
};
