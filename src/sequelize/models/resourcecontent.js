'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResourceContent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Resource, { foreignKey: 'resource_id', as: 'resource' });
      this.belongsTo(models.Content, { foreignKey: 'content_id', as: 'content' });
    }
  }
  ResourceContent.init(
    {
      resource_uuid: DataTypes.INTEGER,
      content_uuid: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ResourceContent',
      tableName: 'resource_contents',
      timestamps: false,
    },
  );
  return ResourceContent;
};
