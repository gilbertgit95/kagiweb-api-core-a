import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountAccountRefRoleController from '../controllers/accountAccountRefRoleController'
import { IRoleRef } from '../dataSource/models/accountModel'
import { IRole } from '../dataSource/models/roleModel'
import { IFeature } from '../dataSource/models/featureModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId/defaultMappedRole', async (req, res) => {
    const { accountId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRole & {accountFeatures: IFeature[]}>(async () => {
        return await accountAccountRefRoleController.getDefaultMappedRoleRef(accountId, accountRefId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId/roles', async (req, res) => {
    const { accountId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef[]>(async () => {
        return await accountAccountRefRoleController.getRoleRefs(accountId, accountRefId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId/roles/:roleRefId', async (req, res) => {
    const { accountId, accountRefId, roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountAccountRefRoleController.getRoleRef(accountId, accountRefId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId/roles', async (req, res) => {
    const { accountId, accountRefId } = req.params
    const { roleId } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountAccountRefRoleController.saveRoleRef(accountId, accountRefId, roleId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId/roles/:roleRefId', async (req, res) => {
    const { accountId, accountRefId, roleRefId } = req.params
    const { roleId } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountAccountRefRoleController.updateRoleRef(accountId, accountRefId, roleRefId, roleId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId/roles/:roleRefId', async (req, res) => {
    const { accountId, accountRefId, roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await accountAccountRefRoleController.deleteRoleRef(accountId, accountRefId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router