'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Scraper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Keyword, { foreignKey: 'last_keyword_id', as: 'last_keyword' });
    }
  }
  Scraper.init(
    {
      service_type: DataTypes.INTEGER,
      word_type: DataTypes.INTEGER,
      last_keyword_id: DataTypes.INTEGER,
      last_request_url: DataTypes.TEXT,
      last_request_params: DataTypes.TEXT,
      executed_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Scraper',
      tableName: 'scrapers',
      timestamps: false,
    },
  );
  return Scraper;
};
