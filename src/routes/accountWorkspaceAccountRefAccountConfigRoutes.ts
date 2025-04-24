import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountWorkspaceAccountRefAccountConfigController from '../controllers/accountWorkspaceAccountRefAcountConfigController'
import { IAccountConfig } from '../dataSource/models/accountModel'

const router: express.Router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId/accountConfigs', async (req, res) => {
    const { accountId, workspaceId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig[]>(async () => {
        return await accountWorkspaceAccountRefAccountConfigController.getAccountConfigs(accountId, workspaceId, accountRefId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId/accountConfigs/:accountConfigId', async (req, res) => {
    const { accountId, workspaceId, accountRefId, accountConfigId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig>(async () => {
        return await accountWorkspaceAccountRefAccountConfigController.getAccountConfig(accountId, workspaceId, accountRefId, accountConfigId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/workspaces/:workspaceId/accountRefs/:accountRefId/accountConfigs/:accountConfigId', async (req, res) => {
   const { accountId, workspaceId, accountRefId, accountConfigId } = req.params
    const { value } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig>(async () => {
        return await accountWorkspaceAccountRefAccountConfigController.updateAccountConfig(accountId, workspaceId, accountRefId, accountConfigId, value)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router