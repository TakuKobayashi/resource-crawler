'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResourceKeyword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Resource, { foreignKey: 'resource_id', as: 'resource' });
      this.belongsTo(models.Keyword, { foreignKey: 'keyword_id', as: 'keyword' });
    }
  }
  ResourceKeyword.init(
    {
      resource_id: DataTypes.INTEGER,
      keyword_id: DataTypes.INTEGER,
      score: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'resource_keyword',
    },
  );
  return ResourceKeyword;
};
