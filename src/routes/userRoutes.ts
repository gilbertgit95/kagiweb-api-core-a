import express from 'express'

// import UserModel, { IUser } from '../dataSource/models/userModel'
import ErrorHandler from '../utilities/errorHandler'
import DataRequest from '../utilities/dataQuery'
import Config from '../utilities/config'

import userController from '../controllers/userController'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const [result, statusCode] = await ErrorHandler.execute(async () => {
        return await userController.getUsersByPage({}, pageInfo)
    })

    if (typeof statusCode === 'number') return res.status(statusCode).send(result)
    return res.json(result)
})

router.get(env.RootApiEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params

    const [result, statusCode] = await ErrorHandler.execute(async () => {
        // return = await userController.saveUser(userData)
        console.log('get user: ', userId)
    })

    if (typeof statusCode === 'number') return res.status(statusCode).send(result)
    return res.json(result)
})

router.post(env.RootApiEndpoint + 'users/create', async (req, res) => {
    const userData = req.body

    const [result, statusCode] = await ErrorHandler.execute(async () => {
        // return = await userController.saveUser(userData)
        console.log('create user: ', userData)
    })

    if (typeof statusCode === 'number') return res.status(statusCode).send(result)
    return res.json(result)
})

router.put(env.RootApiEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params
    const userData = req.body

    const [result, statusCode] = await ErrorHandler.execute(async () => {
        if (userId && userData) {
            return await userController.updateUser(userId, userData)
        }
    })

    if (typeof statusCode === 'number') return res.status(statusCode).send(result)
    return res.json(result)
})

router.delete(env.RootApiEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params

    const [result, statusCode] = await ErrorHandler.execute(async () => {
        if (userId) {
            return await userController.deleteUser(userId)
        }
    })

    if (typeof statusCode === 'number') return res.status(statusCode).send(result)
    return res.json(result)
})

export default router