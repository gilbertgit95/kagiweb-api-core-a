'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Role, AccountClaim }) {
      // define association here
      this.belongsTo(Role, {
        as: 'role',
        foreignKey: 'roleId',
        foreignKeyConstraint: true
      })
      this.hasMany(AccountClaim, {
        as: 'accountClaims',
        foreignKey: 'accountId',
        foreignKeyConstraint: true
      })
    }

    toJSON() {
      return {
        ...this.get(),
        password: undefined,
        resetPasswordKey: undefined,
        loginAccountKey: undefined
      }
    }
  };
  Account.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true,
        is: /[a-zA-Z0-9_@]{6,}/
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    twoFactorAuth: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    disableAccount: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    primaryEmail: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    secondayEmail: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    primaryEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    secondaryEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    primaryNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    secondayNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    primaryNumberVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    secondaryNumberVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    resetPasswordKey: {
      type: DataTypes.STRING
    },
    resetPasswordAttempt: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    loginAccountKey: {
      type: DataTypes.STRING
    },
    loginAccountAttempt: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts'
  });
  return Account;
};