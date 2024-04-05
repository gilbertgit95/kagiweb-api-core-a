import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userClientDeviceAccessTokenController from '../controllers/userClientDeviceAccessTokenController'
import { IAccessToken } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId/userRefs', async (req, res) => {
    const { userId, workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken[]>(async () => {
        return await userClientDeviceAccessTokenController.getClientDeviceAccessTokens(userId, workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId/userRefs', async (req, res) => {
    const { userId, workspaceId } = req.params
    const { jwt, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.saveClientDeviceAccessToken(userId, workspaceId, jwt, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId/userRefs/:userRefId', async (req, res) => {
    const { userId, workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.getClientDeviceAccessToken(userId, workspaceId, userRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId/userRefs/:userRefId', async (req, res) => {
   const { userId, workspaceId, userRefId } = req.params
    const { jwt, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.updateClientDeviceAccessToken(userId, workspaceId, userRefId, jwt, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId/userRefs/:userRefId', async (req, res) => {
   const { userId, workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.deleteClientDeviceAccessToken( userId, workspaceId, userRefId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router