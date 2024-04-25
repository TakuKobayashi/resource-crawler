'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Resource, {
        through: models.ResourceContent,
        foreignKey: 'content_uuid',
        sourceKey: 'uuid',
        otherKey: 'resource_uuid',
        targetKey: 'uuid',
        as: 'resources',
      });
      this.hasMany(models.ResourceContent, { foreignKey: 'content_uuid', sourceKey: 'uuid', as: 'resource_contents' });
      this.hasOne(models.ContentDetail, { foreignKey: 'content_uuid', sourceKey: 'uuid', as: 'detail' });
    }
  }
  Content.init(
    {
      service_type: DataTypes.INTEGER,
      title: DataTypes.STRING,
      website_url: DataTypes.STRING,
      service_content_id: DataTypes.STRING,
      service_user_id: DataTypes.STRING,
      service_user_name: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Content',
      tableName: 'contents',
      timestamps: false,
    },
  );
  return Content;
};
