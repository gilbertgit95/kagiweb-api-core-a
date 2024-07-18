import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userPasswordController from '../controllers/userPasswordController'
import { IPassword } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/passwords', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword[]>(async () => {
        return await userPasswordController.getPasswords(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/passwords', async (req, res) => {
    const { accountId } = req.params
    const { currentPassword, newPassword } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        return await userPasswordController.savePassword(accountId, currentPassword, newPassword)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/passwords/:passwordId', async (req, res) => {
    const { accountId, passwordId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        return await userPasswordController.getPassword(accountId, passwordId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/passwords/:passwordId', async (req, res) => {
   const { accountId, passwordId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        return await userPasswordController.deletePassword( accountId, passwordId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router