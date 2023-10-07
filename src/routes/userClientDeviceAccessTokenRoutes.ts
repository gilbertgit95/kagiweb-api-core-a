import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userClientDeviceAccessTokenController from '../controllers/userClientDeviceAccessTokenController'
import { IAccessToken } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users/:userId/clientDevices/:clientDeviceId/accessTokens', async (req, res) => {
    const { userId, clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken[]>(async () => {
        return await userClientDeviceAccessTokenController.getClientDeviceAccessTokens(userId, clientDeviceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'users/:userId/clientDevices/:clientDeviceId/accessTokens', async (req, res) => {
    const { userId, clientDeviceId } = req.params
    const { jwt, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.saveClientDeviceAccessToken(userId, clientDeviceId, jwt, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'users/:userId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req, res) => {
    const { userId, clientDeviceId, accessTokenId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.getClientDeviceAccessToken(userId, clientDeviceId, accessTokenId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'users/:userId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req, res) => {
   const { userId, clientDeviceId, accessTokenId } = req.params
    const { jwt, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.updateClientDeviceAccessToken(userId, clientDeviceId, accessTokenId, jwt, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'users/:userId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req, res) => {
   const { userId, clientDeviceId, accessTokenId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.deleteClientDeviceAccessToken( userId, clientDeviceId, accessTokenId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router