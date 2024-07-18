import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userLimitedTransactionController from '../controllers/userLimitedTransactionController'
import { ILimitedTransaction } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/limitedTransactions', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction[]>(async () => {
        return await userLimitedTransactionController.getLimitedTransactions(accountId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/limitedTransactions/:limitedTransactionId', async (req, res) => {
    const { accountId, limitedTransactionId } = req.params

    console.log(limitedTransactionId)

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction>(async () => {
        return await userLimitedTransactionController.getLimitedTransaction(accountId, limitedTransactionId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/limitedTransactions/:limitedTransactionId', async (req, res) => {
    const { accountId, limitedTransactionId } = req.params
    const {
        limit, attempts, key,
        value, recipient,
        disabled
    } = req.body

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction>(async () => {
        return await userLimitedTransactionController.updateLimitedTransaction(
            accountId, limitedTransactionId,
            limit, attempts, key,
            value, recipient,
            disabled
        )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router