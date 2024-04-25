'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resource extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Keyword, {
        through: models.ResourceKeyword,
        foreignKey: 'resource_id',
        otherKey: 'keyword_id',
        as: 'keywords',
      });
      this.belongsToMany(models.Content, {
        through: models.ResourceContent,
        foreignKey: 'resource_id',
        otherKey: 'content_id',
        as: 'contents',
      });
      this.hasOne(models.ResourceArchive, { foreignKey: 'resource_id', as: 'archive' });
      this.hasMany(models.ResourceKeyword, { foreignKey: 'resource_id', as: 'resource_keywords' });
      this.hasMany(models.ResourceContent, { foreignKey: 'resource_id', as: 'resource_contents' });
    }
  }
  Resource.init(
    {
      content_id: DataTypes.INTEGER,
      resource_type: DataTypes.INTEGER,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Resource',
      tableName: 'resources',
      timestamps: false,
    },
  );
  return Resource;
};
