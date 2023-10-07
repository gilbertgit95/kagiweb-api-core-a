import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userUserInfoController from '../controllers/userUserInfoController'
import { IUserInfo } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users/:userId/userInfos', async (req, res) => {
    const { userId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo[]>(async () => {
        return await userUserInfoController.getUserInfos(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'users/:userId/userInfos', async (req, res) => {
    const { userId } = req.params
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        return await userUserInfoController.saveUserInfo(userId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'users/:userId/userInfos/:userInfoId', async (req, res) => {
    const { userId, userInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        return await userUserInfoController.getUserInfo(userId, userInfoId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'users/:userId/userInfos/:userInfoId', async (req, res) => {
   const { userId, userInfoId } = req.params
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        return await userUserInfoController.updateUserInfo(userId, userInfoId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'users/:userId/userInfos/:userInfoId', async (req, res) => {
   const { userId, userInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        return await userUserInfoController.deleteUserInfo( userId, userInfoId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router