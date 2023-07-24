import {
    connectDB,
    disconnectDB,
    clearDatabase
} from '../dataSourceConn'

import UserModel, { IUser } from '../../../src/dataSource/models/userModel'

describe('User Model Testing', () => {
    beforeAll(async () => {
        await connectDB();
    })

    afterAll(async () => {
        await UserModel.collection.drop();
        await disconnectDB();
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

    const userUpdateData:IUser = {
        username: 'bertwothree',
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

    test('User Create Test', async () => {
        const user = new UserModel(userData)
        const createdUser = await user.save()

        // console.log(createdUser)
        expect(createdUser).toBeDefined()
        expect(createdUser.username).toBe(user.username)
    })

    test('User Read Test', async () => {
        const user = new UserModel(userData)
        await user.save()

        const fetchedUser = await UserModel.findOne()

        expect(fetchedUser).toBeDefined()
        expect(fetchedUser).toMatchObject(userData)
    })

    test('User Update Test', async () => {
        const user = new UserModel(userData)
        await user.save()

        const fetchedUser = await UserModel.findOne()
        await UserModel.updateOne({
            _id: fetchedUser && fetchedUser._id? fetchedUser._id: ''
        }, userUpdateData)
        const fetchedUpdatedUser = await UserModel.findOne()

        expect(fetchedUpdatedUser).toBeDefined()
        expect(fetchedUpdatedUser).toMatchObject(userUpdateData)
        expect(fetchedUpdatedUser).not.toMatchObject(userData)
    })

    test('User Delete Test', async () => {
        const fetchedUser = await UserModel.findOne()
        await UserModel.deleteOne({
            _id: fetchedUser && fetchedUser._id? fetchedUser._id: ''
        })
        const user = await UserModel.findOne({
            _id: fetchedUser && fetchedUser._id? fetchedUser._id: ''
        })
        expect(user).toBeNull()
    })
})