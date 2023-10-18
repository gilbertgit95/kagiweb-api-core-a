import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import workspaceUserController from '../controllers/workspaceUserController'
import { IUserRef } from '../dataSource/models/workspaceModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'workspaces/:workspaceId/users', async (req, res) => {
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef[]>(async () => {
        return await workspaceUserController.getFeatureRefs(workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'workspaces/:workspaceId/users', async (req:any, res) => {
    const currUserId = req.user._id
    const { workspaceId } = req.params
    const { userId } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        return await workspaceUserController.saveFeatureRef(currUserId, workspaceId, userId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'workspaces/:workspaceId/users/:userRefId', async (req, res) => {
    const { workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        return await workspaceUserController.getFeatureRef(workspaceId, userRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'workspaces/:workspaceId/users/:userRefId', async (req:any, res) => {
    const currUserId = req.user._id
    const { workspaceId, userRefId } = req.params
    const { userId } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        return await workspaceUserController.updateFeatureRef(currUserId, workspaceId, userRefId, userId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'workspaces/:workspaceId/users/:userRefId', async (req:any, res) => {
    const currUserId = req.user._id
    const { workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        return await workspaceUserController.deleteFeatureRef(currUserId, workspaceId, userRefId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router