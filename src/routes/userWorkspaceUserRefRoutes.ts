import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userWorkspaceUserRefController from '../controllers/userWorkspaceUserRefController'
import { IWorkspaceUserRef } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId/userRefs', async (req, res) => {
    const { userId, workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<(IWorkspaceUserRef & {username?:string})[]>(async () => {
        return await userWorkspaceUserRefController.getWorkspaceUserRefs(userId, workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId/userRefs', async (req, res) => {
    const { userId, workspaceId } = req.params
    const { username, readAccess, updateAccess, createAccess, deleteAccess, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceUserRef>(async () => {
        return await userWorkspaceUserRefController.saveWorkspaceUserRef(userId, workspaceId, username, readAccess, updateAccess, createAccess, deleteAccess, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId/userRefs/:userRefId', async (req, res) => {
    const { userId, workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceUserRef & {username?:string}>(async () => {
        return await userWorkspaceUserRefController.getWorkspaceUserRef(userId, workspaceId, userRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId/userRefs/:userRefId', async (req, res) => {
    const { userId, workspaceId, userRefId } = req.params
    const { readAccess, updateAccess, createAccess, deleteAccess, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceUserRef>(async () => {
        return await userWorkspaceUserRefController.updateWorkspaceUserRef(userId, workspaceId, userRefId, readAccess, updateAccess, createAccess, deleteAccess, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId/userRefs/:userRefId', async (req, res) => {
   const { userId, workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceUserRef>(async () => {
        return await userWorkspaceUserRefController.deleteWorkspaceUserRef( userId, workspaceId, userRefId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router