import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountWorkspaceAccountRefRoleController from '../controllers/accountWorkspaceAccountRefRoleController'
import { IRoleRef } from '../dataSource/models/accountModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId/roles', async (req, res) => {
    const { accountId, workspaceId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef[]>(async () => {
        return await accountWorkspaceAccountRefRoleController.getRoleRefs(accountId, workspaceId, accountRefId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId/roles/:roleRefId', async (req, res) => {
    const { accountId, workspaceId, accountRefId, roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountWorkspaceAccountRefRoleController.getRoleRef(accountId, workspaceId, accountRefId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId/roles', async (req, res) => {
    const { accountId, workspaceId, accountRefId } = req.params
    const { roleId } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountWorkspaceAccountRefRoleController.saveRoleRef(accountId, workspaceId, accountRefId, roleId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId/roles/:roleRefId', async (req, res) => {
    const { accountId, workspaceId, accountRefId, roleRefId } = req.params
    const { roleId } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountWorkspaceAccountRefRoleController.updateRoleRef(accountId, workspaceId, accountRefId, roleRefId, roleId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId/roles/:roleRefId', async (req, res) => {
    const { accountId, workspaceId, accountRefId, roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountWorkspaceAccountRefRoleController.deleteRoleRef(accountId, workspaceId, accountRefId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router