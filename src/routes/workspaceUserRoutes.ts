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
        return await workspaceUserController.getUserRefs(workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'workspaces/:workspaceId/users', async (req:any, res) => {
    const currUserId = req?.userData?._id
    const { workspaceId } = req.params
    const { userId, readAccess, writeAccess } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        return await workspaceUserController.saveUserRef(currUserId, workspaceId, userId, readAccess, writeAccess)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'workspaces/:workspaceId/users/:userRefId', async (req, res) => {
    const { workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        return await workspaceUserController.getUserRef(workspaceId, userRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'workspaces/:workspaceId/users/:userRefId', async (req:any, res) => {
    const currUserId = req?.userData?._id
    const { workspaceId, userRefId } = req.params
    const { userId, readAccess, writeAccess } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        return await workspaceUserController.updateUserRef(currUserId, workspaceId, userRefId, userId, readAccess, writeAccess)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'workspaces/:workspaceId/users/:userRefId', async (req:any, res) => {
    const currUserId = req?.userData?._id
    const { workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        return await workspaceUserController.deleteUserRef(currUserId, workspaceId, userRefId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router