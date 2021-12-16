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

    await queryInterface.bulkInsert('account_claims', [
      {
        "id": "e79c8692-4cc2-4971-a52c-832e87b11e8f",
        "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
        "key": "fullName",
        "value": "Master Account",
        "createdAt": "2021-11-20T15:27:31.513Z",
        "updatedAt": "2021-11-20T15:27:31.513Z"
      },
      {
        "id": "e79c8692-4cc2-4971-a52c-832e87b12e8f",
        "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
        "key": "gender",
        "value": "Male",
        "createdAt": "2021-11-20T15:27:31.513Z",
        "updatedAt": "2021-11-20T15:27:31.513Z"
      },
      {
        "id": "e79c8692-4cc2-4971-a52c-832e87b13e8f",
        "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
        "key": "language",
        "value": "Bisaya",
        "createdAt": "2021-11-20T15:27:31.513Z",
        "updatedAt": "2021-11-20T15:27:31.513Z"
      },
      {
        "id": "e79c8692-4cc2-4971-a52c-832e87b11e7f",
        "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
        "key": "fullName",
        "value": "Berto Admin",
        "createdAt": "2021-11-20T15:27:31.513Z",
        "updatedAt": "2021-11-20T15:27:31.513Z"
      },
      {
        "id": "e79c8692-4cc2-4971-a52c-832e87b12e7f",
        "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
        "key": "gender",
        "value": "Male",
        "createdAt": "2021-11-20T15:27:31.513Z",
        "updatedAt": "2021-11-20T15:27:31.513Z"
      },
      {
        "id": "e79c8692-4cc2-4971-a52c-832e87b13e7f",
        "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
        "key": "language",
        "value": "Bisaya",
        "createdAt": "2021-11-20T15:27:31.513Z",
        "updatedAt": "2021-11-20T15:27:31.513Z"
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
    await queryInterface.bulkDelete('account_claims', null, {});
  }
};
