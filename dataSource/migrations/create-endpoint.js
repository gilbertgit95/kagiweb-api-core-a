'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('endpoints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      endpoint: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subcategory: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
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
    await queryInterface.dropTable('endpoints');
  }
};