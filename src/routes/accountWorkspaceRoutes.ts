import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountWorkspaceController from '../controllers/accountWorkspaceController'
import { IWorkspace } from '../dataSource/models/accountModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/workspaces', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace[]>(async () => {
        return await accountWorkspaceController.getWorkspaces(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/workspaces', async (req, res) => {
    const { accountId } = req.params
    const { name, description, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await accountWorkspaceController.saveWorkspace(accountId, name, description, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId', async (req, res) => {
    const { accountId, workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await accountWorkspaceController.getWorkspace(accountId, workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId', async (req, res) => {
   const { accountId, workspaceId } = req.params
    const { name, description, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await accountWorkspaceController.updateWorkspace(accountId, workspaceId, name, description, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId', async (req, res) => {
   const { accountId, workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await accountWorkspaceController.deleteWorkspace( accountId, workspaceId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router