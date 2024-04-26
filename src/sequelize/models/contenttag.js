'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContentTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Content, { foreignKey: 'content_id', as: 'content' });
    }
  }
  ContentTag.init(
    {
      content_id: DataTypes.INTEGER,
      tag: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ContentTag',
      tableName: 'content_tags',
      timestamps: false,
    },
  );
  return ContentTag;
};
