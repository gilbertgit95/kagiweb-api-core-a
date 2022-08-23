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
            "id": "e09c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "profilepicture",
            "type": "text",
            "value": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e29c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "firstname",
            "type": "text",
            "value": "Gilbert",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e39c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "middlename",
            "type": "text",
            "value": "Defante",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e49c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "lastname",
            "type": "text",
            "value": "cuerbo",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e59c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "nickname",
            "type": "text",
            "value": "gigi",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e59c8692-5cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "gender",
            "type": "text",
            "value": "male",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e69c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "nationality",
            "type": "text",
            "value": "Filipino",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e70c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "country",
            "type": "text",
            "value": "PH",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e89c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "birthdate",
            "type": "date",
            "value": "1995-04-27",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e99c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "birthplace",
            "type": "text",
            "value": "Cantilan, Surigao del Sur",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e10c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "homeaddress",
            "type": "text",
            "value": "Pagantayan, Cantilan, Surigao del Sur",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e11c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "personalwebsite",
            "type": "url",
            "value": "https://gilbertgit95.github.com",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e12c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "bio",
            "type": "text",
            "value": "As a modern farmer.",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e13c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "companyrole",
            "type": "text",
            "value": "Fullstack Javascript Developer",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e14c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "companyname",
            "type": "Kagiweb",
            "value": "Fullstack Javascript Developer",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e15c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "companydesc",
            "type": "text",
            "value": "A software solution company.",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e16c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "companyindustry",
            "type": "text",
            "value": "Information Tech.",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e17c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "companyemail",
            "type": "text",
            "value": "hello@kagiweb.com",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e18c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "companyphone",
            "type": "text",
            "value": "+639273854600",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e19c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "companywebsite",
            "type": "url",
            "value": "https://gilbertgit95.github.com",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e20c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "companyaddress",
            "type": "text",
            "value": "Davao City",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e21c8692-4cc2-4971-a52c-832e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b28e8f",
            "key": "companycountry",
            "type": "text",
            "value": "PH",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e19c8692-4cc2-4971-a52c-833e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "profilepicture",
            "type": "text",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e29c8692-4cc2-4971-a52c-834e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "firstname",
            "type": "text",
            "value": "luna",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e39c8692-4cc2-4971-a52c-835e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "middlename",
            "type": "text",
            "value": "intano",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e49c8692-4cc2-4971-a52c-836e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "lastname",
            "type": "text",
            "value": "cuerbo",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e59c8692-4cc2-4971-a52c-837e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "nickname",
            "type": "text",
            "value": "nana, mingming",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e59c8692-5cc2-4971-a52c-838e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "gender",
            "type": "text",
            "value": "female",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e69c8692-4cc2-4971-a52c-839e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "nationality",
            "type": "text",
            "value": "Filipino",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e70c8692-4cc2-4971-a52c-840e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "country",
            "type": "text",
            "value": "PH",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e89c8692-4cc2-4971-a52c-841e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "birthdate",
            "type": "date",
            "value": "2022-06-07",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e99c8692-4cc2-4971-a52c-842e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "birthplace",
            "type": "text",
            "value": "Davao City",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e10c8692-4cc2-4971-a52c-843e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "homeaddress",
            "type": "text",
            "value": "Pagantayan, Cantilan, Surigao del Sur",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e11c8692-4cc2-4971-a52c-844e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "personalwebsite",
            "type": "url",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e12c8692-4cc2-4971-a52c-845e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "bio",
            "type": "text",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e13c8692-4cc2-4971-a52c-846e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "companyrole",
            "type": "text",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e14c8692-4cc2-4971-a52c-847e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "companyname",
            "type": "text",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e15c8692-4cc2-4971-a52c-848e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "companydesc",
            "type": "text",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e16c8692-4cc2-4971-a52c-849e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "companyindustry",
            "type": "text",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e17c8692-4cc2-4971-a52c-850e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "companyemail",
            "type": "text",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e18c8692-4cc2-4971-a52c-851e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "companyphone",
            "type": "text",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e19c8692-4cc2-4971-a52c-852e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "companywebsite",
            "type": "url",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e20c8692-4cc2-4971-a52c-853e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "companyaddress",
            "type": "text",
            "value": "",
            "createdAt": "2021-11-20T15:27:31.513Z",
            "updatedAt": "2021-11-20T15:27:31.513Z"
        },
        {
            "id": "e21c8692-4cc2-4971-a52c-854e87b11e8f",
            "accountId": "e79c8692-4cc2-4971-a52c-832e87b27e7f",
            "key": "companycountry",
            "type": "text",
            "value": "",
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
