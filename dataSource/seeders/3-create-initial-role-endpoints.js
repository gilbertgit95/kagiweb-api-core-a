'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('role_endpoints', [
      {
        roleId: 1,
        endpointId: 1,
        createdAt: '2021-11-08T13:18:40.558Z',
        updatedAt: '2021-11-08T13:18:40.558Z'
      },
      {
        roleId: 1,
        endpointId: 2,
        createdAt: '2021-11-08T13:18:40.558Z',
        updatedAt: '2021-11-08T13:18:40.558Z'
      },
      {
        roleId: 1,
        endpointId: 3,
        createdAt: '2021-11-08T13:18:40.558Z',
        updatedAt: '2021-11-08T13:18:40.558Z'
      },
      {
        roleId: 1,
        endpointId: 4,
        createdAt: '2021-11-08T13:18:40.558Z',
        updatedAt: '2021-11-08T13:18:40.558Z'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
