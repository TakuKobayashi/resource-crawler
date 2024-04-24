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
      this.belongsTo(models.Content, { foreignKey: 'id', as: 'content' });
      this.belongsToMany(models.Keyword, {
        through: models.ResourceKeyword,
        foreignKey: 'resource_id',
        otherKey: 'keyword_id',
        as: 'keywords',
      });
      this.hasOne(models.ResourceArchive, { foreignKey: 'resource_id', as: 'archive' });
      this.hasMany(models.ResourceKeyword, { foreignKey: 'resource_id', as: 'resources' });
    }
  }
  Resource.init(
    {
      title: DataTypes.STRING,
      content_id: DataTypes.STRING,
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
