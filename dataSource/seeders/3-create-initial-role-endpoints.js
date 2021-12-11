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
    // await queryInterface.bulkInsert('role_endpoints', [
    //   {
    //     uuid: "d3d4ef5b-dba7-4124-8380-9823008e805a",
    //     createdAt: "2021-11-28T18:34:08.097Z",
    //     updatedAt: "2021-11-28T18:34:08.097Z",
    //     endpointId: 1,
    //     roleId: 2
    //   },
    //   {
    //     uuid: "39bc65ac-316d-4296-8af3-d3a65cd61f98",
    //     createdAt: "2021-11-28T18:34:08.097Z",
    //     updatedAt: "2021-11-28T18:34:08.097Z",
    //     endpointId: 2,
    //     roleId: 2
    //   },
    //   {
    //     uuid: "d2df9e64-1cc3-45aa-b21f-00327f615ce8",
    //     createdAt: "2021-11-28T18:34:08.097Z",
    //     updatedAt: "2021-11-28T18:34:08.097Z",
    //     endpointId: 3,
    //     roleId: 2
    //   },
    //   {
    //     uuid: "47f1a896-8151-4edc-8482-dc2ad8b9b3d4",
    //     createdAt: "2021-11-28T18:34:08.097Z",
    //     updatedAt: "2021-11-28T18:34:08.097Z",
    //     endpointId: 4,
    //     roleId: 2
    //   },
    //   {
    //     uuid: "2c460738-1756-410c-8c5c-bbaef185247e",
    //     createdAt: "2021-11-28T18:34:08.097Z",
    //     updatedAt: "2021-11-28T18:34:08.097Z",
    //     endpointId: 5,
    //     roleId: 2
    //   }
    // ], {});
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
