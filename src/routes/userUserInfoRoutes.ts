import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userUserInfoController from '../controllers/userUserInfoController'
import { IAccountInfo } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountInfos', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountInfo[]>(async () => {
        return await userUserInfoController.getUserInfos(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/accountInfos', async (req, res) => {
    const { accountId } = req.params
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccountInfo>(async () => {
        return await userUserInfoController.saveUserInfo(accountId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountInfos/:accountInfoId', async (req, res) => {
    const { accountId, accountInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountInfo>(async () => {
        return await userUserInfoController.getUserInfo(accountId, accountInfoId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/accountInfos/:accountInfoId', async (req, res) => {
   const { accountId, accountInfoId } = req.params
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccountInfo>(async () => {
        return await userUserInfoController.updateUserInfo(accountId, accountInfoId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/accountInfos/:accountInfoId', async (req, res) => {
   const { accountId, accountInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountInfo>(async () => {
        return await userUserInfoController.deleteUserInfo( accountId, accountInfoId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router