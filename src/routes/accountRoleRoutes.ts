import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountRoleController from '../controllers/accountRoleController'
import { IRoleRef } from '../dataSource/models/accountModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/roles', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef[]>(async () => {
        return await accountRoleController.getRoleRefs(accountId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/roles/:roleRefId', async (req, res) => {
    const { accountId, roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountRoleController.getRoleRef(accountId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/roles', async (req, res) => {
    const { accountId } = req.params
    const { roleId, isActive } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountRoleController.saveRoleRef(accountId, roleId, isActive)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/roles/:roleRefId', async (req, res) => {
    const { accountId, roleRefId } = req.params
    const { roleId, isActive } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountRoleController.updateRoleRef(accountId, roleRefId, roleId, isActive)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/roles/:roleRefId/activate', async (req, res) => {
    const { accountId, roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountRoleController.activateAccountRole(accountId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/roles/:roleRefId', async (req, res) => {
    const { accountId, roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountRoleController.deleteRoleRef(accountId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router