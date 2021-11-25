'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Endpoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Role, Endpoint, RoleEndpoint }) {
      // define association here
      this.belongsToMany(Role, {
        as: 'roles',
        through: RoleEndpoint,
        foreignKey: 'endpointId',
        foreignKeyConstraint: true
      })
    }

    toJSON() {
      return {...this.get(), id: undefined}
    }
  };
  Endpoint.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Endpoint',
    tableName: 'endpoints'
  });
  return Endpoint;
};