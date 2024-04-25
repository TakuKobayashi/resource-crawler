'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResourceArchive extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Resource, { foreignKey: 'resource_id', as: 'resource' });
    }
  }
  ResourceArchive.init(
    {
      resource_id: DataTypes.INTEGER,
      save_path: DataTypes.STRING,
      resource_hash: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ResourceArchive',
      tableName: 'resource_archives',
    },
  );
  return ResourceArchive;
};
