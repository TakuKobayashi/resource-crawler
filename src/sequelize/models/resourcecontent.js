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
      this.belongsTo(models.Resource, { foreignKey: 'resource_uuid', sourceKey: 'uuid', as: 'resource' });
      this.belongsTo(models.Content, { foreignKey: 'content_uuid', sourceKey: 'uuid', as: 'content' });
    }
  }
  ResourceContent.init(
    {
      resource_uuid: DataTypes.STRING,
      content_uuid: DataTypes.STRING,
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
