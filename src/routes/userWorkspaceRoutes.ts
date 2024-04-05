import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userWorkspaceController from '../controllers/userWorkspaceController'
import { IWorkspace } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users/:userId/workspaces', async (req, res) => {
    const { userId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace[]>(async () => {
        return await userWorkspaceController.getWorkspaces(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'users/:userId/workspaces', async (req, res) => {
    const { userId } = req.params
    const { name, description, isActive, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await userWorkspaceController.saveWorkspace(userId, name, description, isActive, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId', async (req, res) => {
    const { userId, workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await userWorkspaceController.getWorkspace(userId, workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId', async (req, res) => {
   const { userId, workspaceId } = req.params
    const { name, description, isActive, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await userWorkspaceController.updateWorkspace(userId, workspaceId, name, description, isActive, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'users/:userId/workspaces/:workspaceId', async (req, res) => {
   const { userId, workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await userWorkspaceController.deleteWorkspace( userId, workspaceId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router