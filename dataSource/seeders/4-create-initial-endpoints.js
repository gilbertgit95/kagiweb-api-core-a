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
    await queryInterface.bulkInsert('endpoints', [
      {
        id: 'db422ca5-b0a0-43b1-9381-417be994f08e',
        endpoint: '/api/v1/endpoints/new',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'POST',
        description: 'create a single endpoint',
        createdAt: '2021-11-08T06:19:31.163Z',
        updatedAt: '2021-11-08T08:11:11.815Z'
      },
      {
        id: 'e1dd4461-3cb6-4a8c-8b18-2b4aa99e4d5b',
        endpoint: '/api/v1/endpoints/:id',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'PUT',
        description: 'update a single endpoint',
        createdAt: '2021-11-08T08:12:28.774Z',
        updatedAt: '2021-11-08T08:12:28.774Z'
      },
      {
        id: 'e4401d03-bc3f-4ee2-b344-073b638e0b9c',
        endpoint: '/api/v1/endpoints/:id',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'GET',
        description: 'get a single endpoint',
        createdAt: '2021-11-08T08:13:13.994Z',
        updatedAt: '2021-11-08T08:13:13.994Z'
      },
      {
        id: 'c6ff0af1-851c-480c-ba97-69fef72316d2',
        endpoint: '/api/v1/endpoints/:id',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'DELETE',
        description: 'delete a single endpoint',
        createdAt: '2021-11-08T08:11:58.199Z',
        updatedAt: '2021-11-08T08:14:26.998Z'
      },
      {
        id: '1fc0327c-37a3-45e1-90a4-a9fd1893c6e8',
        endpoint: '/api/v1/accounts/new',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'POST',
        description: 'create single account',
        createdAt: '2021-11-08T13:17:53.715Z',
        updatedAt: '2021-11-08T13:17:53.715Z'
      },
      {
        id: 'e02d2dfe-eb9e-4928-b601-888ea6d8c52b',
        endpoint: '/api/v1/accounts/:id',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'GET',
        description: 'get single account',
        createdAt: '2021-11-08T13:18:24.390Z',
        updatedAt: '2021-11-08T13:18:24.390Z'
      },
      {
        id: '0d20f262-d07e-4eb7-a8da-6c0d4854b72e',
        endpoint: '/api/v1/accounts/:id',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'PUT',
        description: 'update single account',
        createdAt: '2021-11-08T13:18:40.558Z',
        updatedAt: '2021-11-08T13:18:40.558Z'
      },
      {
        id: 'dd28b232-0b27-471c-9c10-fd63f0d8d05f',
        endpoint: '/api/v1/accounts/:id',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'DELETE',
        description: 'delete single account',
        createdAt: '2021-11-08T13:18:54.019Z',
        updatedAt: '2021-11-08T13:18:54.019Z'
      },
      {
        id: 'a1890c7f-bd91-4a87-8aa3-cb21cfc1468e',
        endpoint: '/api/v1/accounts',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'GET',
        description: 'bulk fetch accounts',
        createdAt: '2021-11-08T13:20:18.013Z',
        updatedAt: '2021-11-08T13:20:18.013Z'
      },
      {
        id: '01609e17-5afd-47be-92ff-1565a627baea',
        endpoint: '/api/v1/accounts',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'POST',
        description: 'bulk create accounts',
        createdAt: '2021-11-08T13:20:30.454Z',
        updatedAt: '2021-11-08T13:20:30.454Z'
      },
      {
        id: '9785205b-1e7b-4e3b-bb86-ef0cddda3f53',
        endpoint: '/api/v1/accounts',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'PUT',
        description: 'bulk update accounts',
        createdAt: '2021-11-08T13:20:43.055Z',
        updatedAt: '2021-11-08T13:20:43.055Z'
      },
      {
        id: '526999dc-8998-4c47-9971-1d17f4317997',
        endpoint: '/api/v1/roles/new',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'POST',
        description: 'create single role',
        createdAt: '2021-11-08T13:22:46.998Z',
        updatedAt: '2021-11-08T13:22:46.998Z'
      },
      {
        id: '21f92321-dad4-4819-a2dd-45da972008a8',
        endpoint: '/api/v1/roles/:id',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'GET',
        description: 'get single role',
        createdAt: '2021-11-08T13:23:08.220Z',
        updatedAt: '2021-11-08T13:23:08.220Z'
      },
      {
        id: 'f61f1767-0752-4d37-b5d5-cbe24d81f13c',
        endpoint: '/api/v1/roles/:id',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'PUT',
        description: 'update single role',
        createdAt: '2021-11-08T13:23:32.317Z',
        updatedAt: '2021-11-08T13:23:32.317Z'
      },
      {
        id: '929bd67b-27a4-4095-ada1-8c8326a907de',
        endpoint: '/api/v1/roles/:id',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'DELETE',
        description: 'delete single role',
        createdAt: '2021-11-08T13:23:48.731Z',
        updatedAt: '2021-11-08T13:23:48.731Z'
      },
      {
        id: '1572e48d-409f-4fe9-a8ac-cf070419915a',
        endpoint: '/api/v1/roles',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'DELETE',
        description: 'bulk delete roles',
        createdAt: '2021-11-08T13:24:10.326Z',
        updatedAt: '2021-11-08T13:24:10.326Z'
      },
      {
        id: '74918fc2-3941-4214-a170-dcfb234fa066',
        endpoint: '/api/v1/roles',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'GET',
        description: 'bulk fetch roles',
        createdAt: '2021-11-08T13:24:39.841Z',
        updatedAt: '2021-11-08T13:24:39.841Z'
      },
      {
        id: '56f7f65d-3b50-4ddc-8aeb-1e44f2690d73',
        endpoint: '/api/v1/roles',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'POST',
        description: 'bulk create roles',
        createdAt: '2021-11-08T13:24:59.611Z',
        updatedAt: '2021-11-08T13:24:59.611Z'
      },
      {
        id: '6bf63711-8a5c-4374-900b-23d6dec29b5c',
        endpoint: '/api/v1/roles',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'PUT',
        description: 'bulk update roles',
        createdAt: '2021-11-08T13:25:10.494Z',
        updatedAt: '2021-11-08T13:25:10.494Z'
      },
      {
        id: 'cbb7d880-2208-4b57-b365-8821d82213d6',
        endpoint: '/api/v1/endpoints',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'DELETE',
        description: 'bulk delete endpoints',
        createdAt: '2021-11-08T13:13:56.937Z',
        updatedAt: '2021-11-08T13:13:56.937Z'
      },
      {
        id: 'a9aba5d6-b765-48b7-9c4c-fd127f3e7717',
        endpoint: '/api/v1/endpoints',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'GET',
        description: 'bulk fetch endpoints',
        createdAt: '2021-11-08T13:14:30.368Z',
        updatedAt: '2021-11-08T13:14:30.368Z'
      },
      {
        id: '274410c8-eab3-4a0f-8801-1d55fa69cbe0',
        endpoint: '/api/v1/endpoints',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'POST',
        description: 'bulk create endpoints',
        createdAt: '2021-11-08T13:14:52.127Z',
        updatedAt: '2021-11-08T13:14:52.127Z'
      },
      {
        id: '9801be83-6e88-4096-9349-cb57637fc8ce',
        endpoint: '/api/v1/endpoints',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'PUT',
        description: 'bulk update endpoints',
        createdAt: '2021-11-08T13:15:16.586Z',
        updatedAt: '2021-11-08T13:15:16.586Z'
      },
      {
        id: '1fbd3c27-8c8a-49a3-ada7-7a94783cd538',
        endpoint: '/api/v1/accounts',
        name: '',
        type: 'server',
        category: 'route',
        subcategory: 'DELETE',
        description: 'bulk delete accounts',
        createdAt: '2021-11-08T13:20:02.136Z',
        updatedAt: '2021-11-08T13:20:02.136Z'
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
     await queryInterface.bulkDelete('endpoints', null, {});
  }
};
