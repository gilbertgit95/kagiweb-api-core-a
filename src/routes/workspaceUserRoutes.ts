import express, { Request, Response } from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import workspaceUserController from '../controllers/workspaceUserController'
import { IUserRef } from '../dataSource/models/workspaceModel'

const router = express.Router()
const env = Config.getEnv()
const isGlobal = true

router.get(env.RootApiEndpoint + 'workspaces/:workspaceId/users', async (req:Request, res:Response) => {
    const currLoggedUser = req?.userData?._id
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef[]>(async () => {
        if (!currLoggedUser) return null
        return await workspaceUserController.getUserRefs(isGlobal, currLoggedUser)(workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'workspaces/:workspaceId/users', async (req:Request, res:Response) => {
    const currLoggedUser = req?.userData?._id
    const { workspaceId } = req.params
    const { userId, readAccess, writeAccess } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        if (!currLoggedUser) return null
        return await workspaceUserController.saveUserRef(isGlobal, currLoggedUser)(workspaceId, userId, readAccess, writeAccess)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'workspaces/:workspaceId/users/:userRefId', async (req:Request, res:Response) => {
    const currLoggedUser = req?.userData?._id
    const { workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        if (!currLoggedUser) return null
        return await workspaceUserController.getUserRef(isGlobal, currLoggedUser)(workspaceId, userRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'workspaces/:workspaceId/users/:userRefId', async (req:Request, res:Response) => {
    const currLoggedUser = req?.userData?._id
    const { workspaceId, userRefId } = req.params
    const { userId, readAccess, writeAccess } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        if (!currLoggedUser) return null
        return await workspaceUserController.updateUserRef(isGlobal, currLoggedUser)(workspaceId, userRefId, userId, readAccess, writeAccess)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'workspaces/:workspaceId/users/:userRefId', async (req:Request, res:Response) => {
    const currLoggedUser = req?.userData?._id
    const { workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        if (!currLoggedUser) return null
        return await workspaceUserController.deleteUserRef(isGlobal, currLoggedUser)(workspaceId, userRefId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router