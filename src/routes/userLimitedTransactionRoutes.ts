import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import { routerIdentity } from '../utilities/routerHandler'

import userLimitedTransactionController from '../controllers/userLimitedTransactionController'
import { ILimitedTransaction } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users/:userId/limitedTransactions', async (req, res) => {
    const { userId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction[]>(async () => {
        return await userLimitedTransactionController.getLimitedTransactions(userId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'users/:userId/limitedTransactions/:limitedTransactionId', async (req, res) => {
    const { userId, limitedTransactionId } = req.params

    console.log(limitedTransactionId)

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction>(async () => {
        return await userLimitedTransactionController.getLimitedTransaction(userId, limitedTransactionId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'users/:userId/limitedTransactions/:limitedTransactionId', async (req, res) => {
    const { userId, limitedTransactionId } = req.params
    const {
        limit, attempts, key,
        value, expTime, recipient,
        disabled
    } = req.body

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction>(async () => {
        return await userLimitedTransactionController.updateLimitedTransaction(
            userId, limitedTransactionId,
            limit, attempts, key,
            value, expTime, recipient,
            disabled
        )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router