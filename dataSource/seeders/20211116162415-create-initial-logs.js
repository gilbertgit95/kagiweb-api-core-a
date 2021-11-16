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
    await queryInterface.bulkInsert('logs', [
      [
        {
          message: "accessing the app during development",
          title: "Test log",
          creator: "Gilbert Cuerbo",
          createdAt: "2021-11-08T06:19:31.163Z",
          updatedAt: "2021-11-08T06:19:31.163Z"
        },
        {
          message: "another logging test",
          title: "Test log",
          creator: "Gilbert Cuerbo",
          createdAt: "2021-11-08T08:12:28.774Z",
          updatedAt: "2021-11-08T08:12:28.774Z"
        },
        {
          message: "login by bearer authentication",
          title: "Authentication",
          creator: "Gilbert Cuerbo",
          createdAt: "2021-11-08T13:18:40.558Z",
          updatedAt: "2021-11-08T13:18:40.558Z"
        },
        {
          message: "trigger logout",
          title: "Authentication",
          creator: "Gilbert Cuerbo",
          createdAt: "2021-11-08T13:20:30.454Z",
          updatedAt: "2021-11-08T13:20:30.454Z"
        }
      ]
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('logs', null, {});
  }
};
