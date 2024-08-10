import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountClientDeviceAccessTokenController from '../controllers/accountClientDeviceAccessTokenController'
import { IAccessToken } from '../dataSource/models/accountModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/clientDevices/:clientDeviceId/accessTokens', async (req, res) => {
    const { accountId, clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken[]>(async () => {
        return await accountClientDeviceAccessTokenController.getClientDeviceAccessTokens(accountId, clientDeviceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/clientDevices/:clientDeviceId/accessTokens', async (req, res) => {
    const { accountId, clientDeviceId } = req.params
    const { expiration, description, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await accountClientDeviceAccessTokenController.saveClientDeviceAccessToken(accountId, clientDeviceId, expiration, description, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req, res) => {
    const { accountId, clientDeviceId, accessTokenId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await accountClientDeviceAccessTokenController.getClientDeviceAccessToken(accountId, clientDeviceId, accessTokenId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req, res) => {
   const { accountId, clientDeviceId, accessTokenId } = req.params
    const { description, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await accountClientDeviceAccessTokenController.updateClientDeviceAccessToken(accountId, clientDeviceId, accessTokenId, description, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req, res) => {
   const { accountId, clientDeviceId, accessTokenId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await accountClientDeviceAccessTokenController.deleteClientDeviceAccessToken( accountId, clientDeviceId, accessTokenId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router