import supertest from 'supertest'

import {
    connectDB,
    disconnectDB,
    clearDatabase
} from '../dataSource/dataSourceConn'
import UserModel, { IUser } from '../../src/dataSource/models/userModel'
import app from '../../src/app'

const request = supertest(app)

describe('User Route Testing', () => {
    beforeAll(async () => {
        await connectDB();
    })

    afterAll(async () => {
        await UserModel.collection.drop();
        await disconnectDB()
    })

    afterEach(async () => {
        await clearDatabase()
    })

    const userData:IUser = {
        username: 'bertwo',
        passwords: [{
            key: '101',
            type: 'current'
        }],
        userInfo: [],
        roleRefs: [
            {
                roleId: ''
            }
        ],
        contactInfos: [],
        clientDevices: [],
        limitedTransactions: [
            {
                limit: 15,
                type: 'otp-signin',
                key: 0,
                attempts: 0
            },
            {
                limit: 15,
                type: 'pass-reset',
                key: 0,
                attempts: 0
            },
            {
                limit: 15,
                type: '',
                key: 0,
                attempts: 0
            }
        ]
    }

    // const userUpdateData:IUser = {
    //     username: 'bertwothree',
    //     passwords: [{
    //         key: '101',
    //         type: 'current'
    //     }],
    //     userInfo: [],
    //     roleRefs: [
    //         {
    //             roleId: ''
    //         }
    //     ],
    //     contactInfos: [],
    //     clientDevices: [],
    //     limitedTransactions: [
    //         {
    //             limit: 15,
    //             type: 'otp-signin',
    //             key: 0,
    //             attempts: 0
    //         },
    //         {
    //             limit: 15,
    //             type: 'pass-reset',
    //             key: 0,
    //             attempts: 0
    //         },
    //         {
    //             limit: 15,
    //             type: '',
    //             key: 0,
    //             attempts: 0
    //         }
    //     ]
    // }

    test('POST - /api/v1/users/create', async () => {
        const res = await request.post('/api/v1/users/create').send(userData)
        // const body = res.body
        // const username = body.username

        expect(res.statusCode).toBe(200)
        // expect(username).toBe(userData.username)
    })
})