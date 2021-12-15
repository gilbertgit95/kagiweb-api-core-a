'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccountClaim extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Account }) {
      // define association here
    }

    // toJSON() {
    // }
  };
  AccountClaim.init({
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
    value: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'AccountClaim',
    tableName: 'account_claims'
  });
  return AccountClaim;
};