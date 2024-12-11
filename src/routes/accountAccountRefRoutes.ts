import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountAccountRefController from '../controllers/accountAccountRefController'
import { IAccountAccountRef } from '../dataSource/models/accountModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountRefs', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<(IAccountAccountRef & {nameId?:string})[]>(async () => {
        return await accountAccountRefController.getAccountRefs(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/accountRefs', async (req, res) => {
    const { accountId } = req.params
    const { nameId, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccountAccountRef>(async () => {
        return await accountAccountRefController.saveAccountAccountRef(accountId, nameId, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId', async (req, res) => {
    const { accountId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountAccountRef & {nameId?:string}>(async () => {
        return await accountAccountRefController.getAccountRef(accountId, accountRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId', async (req, res) => {
    const { accountId, accountRefId } = req.params
    const { disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccountAccountRef>(async () => {
        return await accountAccountRefController.updateAccountAccountRef(accountId, accountRefId, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/accountRefs/:accountRefId', async (req, res) => {
   const { accountId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountAccountRef>(async () => {
        return await accountAccountRefController.deleteAccountAccountRef( accountId, accountRefId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router