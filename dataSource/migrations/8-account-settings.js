'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('account_settings', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true
        }
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: 'text'
      },
      value: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('account_settings');
  }
};