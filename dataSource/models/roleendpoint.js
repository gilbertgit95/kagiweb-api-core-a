'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleEndpoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Role, Endpoint }) {
      // define association here
      this.belongsTo(Role, {
        as: 'roles' ,
        foreignKey: {
          name: 'roleId',
          allowNull: false
        }
      })
      this.belongsTo(Endpoint, {
        as: 'endpoints' ,
        foreignKey: {
          name: 'endpointId',
          allowNull: false
        }
      })
    }
  };
  RoleEndpoint.init({}, {
    sequelize,
    modelName: 'RoleEndpoint',
    tableName: 'role_endpoints'
  });
  return RoleEndpoint;
};