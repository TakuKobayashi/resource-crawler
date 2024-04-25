'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Keyword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Resource, {
        through: models.ResourceKeyword,
        foreignKey: 'keyword_id',
        otherKey: 'resource_uuid',
        targetKey: 'uuid',
        as: 'resources',
      });
      this.hasMany(models.ResourceKeyword, { foreignKey: 'keyword_id', as: 'resource_keywords' });
    }
  }
  Keyword.init(
    {
      service_type: DataTypes.INTEGER,
      word_type: DataTypes.INTEGER,
      word: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Keyword',
      tableName: 'keywords',
      timestamps: false,
    },
  );
  return Keyword;
};
