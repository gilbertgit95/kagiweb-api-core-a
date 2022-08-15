'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounts', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      roleId: {
        type: Sequelize.UUID,
        references: { model: 'roles', key: 'id' }
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      twoFactorAuth: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      disabledAccount: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      primaryEmail: {
        type: Sequelize.STRING,
        unique: true
      },
      secondayEmail: {
        type: Sequelize.STRING,
        unique: true
      },
      primaryEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      secondaryEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      primaryNumber: {
        type: Sequelize.STRING,
        unique: true
      },
      secondayNumber: {
        type: Sequelize.STRING,
        unique: true
      },
      primaryNumberVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      secondaryNumberVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      resetPasswordKey: {
        type: Sequelize.STRING
      },
      resetPasswordAttempt: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      loginAccountKey: {
        type: Sequelize.STRING
      },
      loginAccountAttempt: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accounts');
  }
};