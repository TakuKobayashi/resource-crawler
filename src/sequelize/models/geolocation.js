'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Geolocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Geolocation.init(
    {
      source_id: DataTypes.INTEGER,
      source_type: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      geohash: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Geolocation',
      tableName: 'geolocations',
      timestamps: false,
    },
  );
  return Geolocation;
};
