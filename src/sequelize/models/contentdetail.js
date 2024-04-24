'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContentDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Content, { foreignKey: 'content_id', as: 'content' });
    }
  }
  ContentDetail.init(
    {
      content_id: DataTypes.STRING,
      tags: DataTypes.TEXT,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'ContentDetail',
      tableName: 'content_details',
      timestamps: false,
    },
  );
  return ContentDetail;
};
