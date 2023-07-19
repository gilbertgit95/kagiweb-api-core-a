import express from 'express'

// import UserModel, { IUser } from '../dataSource/models/userModel'
import DataRequest from '../utilities/dataQuery'
import Config from '../utilities/config'

import userController from '../controllers/userController'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiCoreEndpoint + 'users', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const result = await userController.getUsersByPage({}, pageInfo)

    return res.json(result)
})

router.get(env.RootApiCoreEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params

    const result = await userController.getUser({_id: userId})

    return res.json(result)
})

router.post(env.RootApiCoreEndpoint + 'users/create', async (req, res) => {
    const userData = req.body
    const resp = await userController.saveUser(userData)

    return res.json(resp)
})

router.put(env.RootApiCoreEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params
    const userData = req.body
    let resp = null

    if (userId && userData) {
        resp = await userController.updateUser(userId, userData)
    }

    return res.json(resp)
})

router.delete(env.RootApiCoreEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params
    let resp = null

    if (userId) {
        resp = await userController.deleteUser(userId)
    }

    return res.json(resp)
})

export default router