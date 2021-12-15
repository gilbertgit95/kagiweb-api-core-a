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

    await queryInterface.bulkInsert('accounts', [
      {
        "id": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
        "username": "master",
        "twoFactorAuth": false,
        "password": "$2b$10$Uk6avcqftAoPCNvk10Serubf8kl1bHQw1.yG.xCpBtbjn3QwX5fTC",
        "disableAccount": false,
        "primaryEmail": null,
        "secondayEmail": null,
        "primaryEmailVerified": false,
        "secondaryEmailVerified": false,
        "primaryNumber": null,
        "secondayNumber": null,
        "primaryNumberVerified": false,
        "secondaryNumberVerified": false,
        "resetPasswordKey": "",
        "resetPasswordAttempt": 0,
        "loginAccountKey": "",
        "loginAccountAttempt": 0,
        "createdAt": "2021-11-20T15:27:31.513Z",
        "updatedAt": "2021-11-20T15:27:31.513Z",
        "roleId": "e79c8692-4cc2-4971-a52c-832e87b46e8f"
      },
      {
        "id": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
        "username": "gilbert95",
        "twoFactorAuth": false,
        "password": "$2b$10$Uk6avcqftAoPCNvk10Serubf8kl1bHQw1.yG.xCpBtbjn3QwX5fTC",
        "disableAccount": false,
        "primaryEmail": null,
        "secondayEmail": null,
        "primaryEmailVerified": false,
        "secondaryEmailVerified": false,
        "primaryNumber": null,
        "secondayNumber": null,
        "primaryNumberVerified": false,
        "secondaryNumberVerified": false,
        "resetPasswordKey": "",
        "resetPasswordAttempt": 0,
        "loginAccountKey": "",
        "loginAccountAttempt": 0,
        "createdAt": "2021-11-20T15:27:31.513Z",
        "updatedAt": "2021-11-20T15:27:31.513Z",
        "roleId": "6b1b7d6a-c325-4908-912c-f485078a53fc"
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
    await queryInterface.bulkDelete('accounts', null, {});
  }
};
