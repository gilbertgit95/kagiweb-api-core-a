import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountAccountRefAccountConfigController from '../controllers/accountAccountRefAcountConfigController'
import { IAccountConfig } from '../dataSource/models/accountModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId/accountConfigs', async (req, res) => {
    const { accountId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig[]>(async () => {
        return await accountAccountRefAccountConfigController.getAccountConfigs(accountId, accountRefId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId/accountConfigs/:accountConfigId', async (req, res) => {
    const { accountId, accountRefId, accountConfigId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig>(async () => {
        return await accountAccountRefAccountConfigController.getAccountConfig(accountId, accountRefId, accountConfigId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId/accountConfigs/:accountConfigId', async (req, res) => {
   const { accountId, accountRefId, accountConfigId } = req.params
    const { value } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig>(async () => {
        return await accountAccountRefAccountConfigController.updateAccountConfig(accountId, accountRefId, accountConfigId, value)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router