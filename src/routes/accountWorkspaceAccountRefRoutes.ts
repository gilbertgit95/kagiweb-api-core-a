import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userWorkspaceUserRefController from '../controllers/accountWorkspaceAccountRefController'
import { IWorkspaceAccountRef } from '../dataSource/models/accountModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs', async (req, res) => {
    const { accountId, workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<(IWorkspaceAccountRef & {username?:string})[]>(async () => {
        return await userWorkspaceUserRefController.getWorkspaceUserRefs(accountId, workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs', async (req, res) => {
    const { accountId, workspaceId } = req.params
    const { username, readAccess, updateAccess, createAccess, deleteAccess, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceAccountRef>(async () => {
        return await userWorkspaceUserRefController.saveWorkspaceUserRef(accountId, workspaceId, username, readAccess, updateAccess, createAccess, deleteAccess, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId', async (req, res) => {
    const { accountId, workspaceId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceAccountRef & {username?:string}>(async () => {
        return await userWorkspaceUserRefController.getWorkspaceUserRef(accountId, workspaceId, accountRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId', async (req, res) => {
    const { accountId, workspaceId, accountRefId } = req.params
    const { readAccess, updateAccess, createAccess, deleteAccess, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceAccountRef>(async () => {
        return await userWorkspaceUserRefController.updateWorkspaceUserRef(accountId, workspaceId, accountRefId, readAccess, updateAccess, createAccess, deleteAccess, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId', async (req, res) => {
   const { accountId, workspaceId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceAccountRef>(async () => {
        return await userWorkspaceUserRefController.deleteWorkspaceUserRef( accountId, workspaceId, accountRefId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router