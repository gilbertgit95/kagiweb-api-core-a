import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountAccountConfigController from '../controllers/accountAccountConfigController'
import { IAccountConfig } from '../dataSource/models/accountModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountConfigs', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig[]>(async () => {
        return await accountAccountConfigController.getAccountConfigs(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/accountConfigs', async (req, res) => {
    const { accountId } = req.params
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig>(async () => {
        return await accountAccountConfigController.saveAccountConfig(accountId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountConfigs/:accountConfigId', async (req, res) => {
    const { accountId, accountConfigId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig>(async () => {
        return await accountAccountConfigController.getAccountConfig(accountId, accountConfigId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/accountConfigs/:accountConfigId', async (req, res) => {
   const { accountId, accountConfigId } = req.params
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig>(async () => {
        return await accountAccountConfigController.updateAccountConfig(accountId, accountConfigId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/accountConfigs/:accountConfigId', async (req, res) => {
   const { accountId, accountConfigId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountConfig>(async () => {
        return await accountAccountConfigController.deleteAccountConfig( accountId, accountConfigId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router