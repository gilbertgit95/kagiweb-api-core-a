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

    await queryInterface.bulkInsert('roles', [
      {
        "uuid": "e79c8692-4cc2-4971-a52c-832e87b46e8f",
        "name": "Super admin",
        "description": "Has access to all endpoints",
        "createdAt": "2021-11-20T15:27:31.513Z",
        "updatedAt": "2021-11-20T15:27:31.513Z"
      },
      {
        "uuid": "6b1b7d6a-c325-4908-912c-f485078a53fc",
        "name": "Admin",
        "description": "Has access to all admin endpoints except app settings",
        "createdAt": "2021-11-20T15:29:09.833Z",
        "updatedAt": "2021-11-20T15:29:09.833Z"
      },
      {
        "uuid": "4a21f627-9455-4920-ac8f-550d91b752bc",
        "name": "Normal user",
        "description": "Has access to some major endpoints",
        "createdAt": "2021-11-20T15:30:48.794Z",
        "updatedAt": "2021-11-20T15:30:48.794Z"
      },
      {
        "uuid": "9fcaacd3-978f-45c4-b51c-da684601024c",
        "name": "Client",
        "description": "Has access to only minor endpoints",
        "createdAt": "2021-11-20T15:31:31.480Z",
        "updatedAt": "2021-11-20T15:31:31.480Z"
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
    await queryInterface.bulkDelete('roles', null, {});
  }
};
