import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import { routerIdentity } from '../utilities/routerHandler'

import userPasswordController from '../controllers/userPasswordController'
import { IPassword } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users/:userId/passwords', async (req, res) => {
    const { userId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword[]>(async () => {
        return await userPasswordController.getPasswords(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'users/:userId/passwords', async (req, res) => {
    const { userId } = req.params
    const { currentPassword, newPassword } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        return await userPasswordController.savePassword(userId, currentPassword, newPassword)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'users/:userId/passwords/:passwordId', async (req, res) => {
    const { userId, passwordId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        return await userPasswordController.getPassword(userId, passwordId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'users/:userId/passwords/:passwordId', async (req, res) => {
   const { userId, passwordId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        return await userPasswordController.deletePassword( userId, passwordId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router