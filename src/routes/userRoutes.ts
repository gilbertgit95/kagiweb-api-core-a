import express from 'express'

// import UserModel, { IUser } from '../dataSource/models/userModel'
import DataRequest from '../utilities/dataQuery'
import Config from '../utilities/config'

import userController from '../controllers/userController'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    console.log('pageInfo: ',pageInfo)

    const result = await userController.getUsersByPage({}, pageInfo)

    return res.json(result)
})

router.post(env.RootApiEndpoint + 'users', async (req, res) => {
    const userData = req.body
    let result = null
    // const resp = await userController.saveUser(userData)
    console.log('bulk or single add user: ', userData)
    return res.json(result)
})

router.get(env.RootApiEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params
    let result = null
    // const resp = await userController.saveUser(userData)
    console.log('get user: ', userId)

    return res.json(result)
})

router.post(env.RootApiEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params
    const userData = req.body
    let result = null
    // const resp = await userController.saveUser(userData)
    console.log('get user: ', userId)
    console.log('update user: ', userData)

    return res.json(result)
})

router.put(env.RootApiEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params
    const userData = req.body
    let resp = null

    if (userId && userData) {
        resp = await userController.updateUser(userId, userData)
    }

    return res.json(resp)
})

router.delete(env.RootApiEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params
    let resp = null

    if (userId) {
        resp = await userController.deleteUser(userId)
    }

    return res.json(resp)
})

export default router