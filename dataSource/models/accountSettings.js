'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccountSettings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AccountSettings.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'text'
    },
    value: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'AccountSettings',
    tableName: 'account_settings'
  });
  return AccountSettings;
};