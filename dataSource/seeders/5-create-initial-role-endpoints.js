"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert("People", [{
     *   name: "John Doe",
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("role_endpoints", [
      {
        id: "d3d4ef5b-dba7-4124-8380-9823008e805a",
        createdAt: "2021-11-28T18:34:08.097Z",
        updatedAt: "2021-11-28T18:34:08.097Z",
        endpointId: "db422ca5-b0a0-43b1-9381-417be994f08e",
        roleId: "6b1b7d6a-c325-4908-912c-f485078a53fc"
      },
      {
        id: "39bc65ac-316d-4296-8af3-d3a65cd61f98",
        createdAt: "2021-11-28T18:34:08.097Z",
        updatedAt: "2021-11-28T18:34:08.097Z",
        endpointId: "e1dd4461-3cb6-4a8c-8b18-2b4aa99e4d5b",
        roleId: "6b1b7d6a-c325-4908-912c-f485078a53fc"
      },
      {
        id: "d2df9e64-1cc3-45aa-b21f-00327f615ce8",
        createdAt: "2021-11-28T18:34:08.097Z",
        updatedAt: "2021-11-28T18:34:08.097Z",
        endpointId: "e4401d03-bc3f-4ee2-b344-073b638e0b9c",
        roleId: "6b1b7d6a-c325-4908-912c-f485078a53fc"
      },
      {
        id: "47f1a896-8151-4edc-8482-dc2ad8b9b3d4",
        createdAt: "2021-11-28T18:34:08.097Z",
        updatedAt: "2021-11-28T18:34:08.097Z",
        endpointId: "c6ff0af1-851c-480c-ba97-69fef72316d2",
        roleId: "6b1b7d6a-c325-4908-912c-f485078a53fc"
      },
      {
        id: "2c460738-1756-410c-8c5c-bbaef185247e",
        createdAt: "2021-11-28T18:34:08.097Z",
        updatedAt: "2021-11-28T18:34:08.097Z",
        endpointId: "1fc0327c-37a3-45e1-90a4-a9fd1893c6e8",
        roleId: "6b1b7d6a-c325-4908-912c-f485078a53fc"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
  }
};
