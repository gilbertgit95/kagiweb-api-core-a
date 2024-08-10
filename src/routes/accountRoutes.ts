import express from 'express'

// import accountModel, { IAccount } from '../dataSource/models/accountModel'
import ErrorHandler from '../utilities/errorHandler'
import DataRequest, {IListOutput} from '../utilities/dataQuery'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountController, { IAccountCompleteInfo } from '../controllers/accountController'
import { IAccount } from '../dataSource/models/accountModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const [result, statusCode] = await ErrorHandler.execute<IListOutput<IAccount>>(async () => {
        return await accountController.getAccountsByPage({}, pageInfo)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts', async (req, res) => {
    const { username, disabled, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccount>(async () => {
        return await accountController.saveAccount(username, disabled, verified)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccount>(async () => {
        return await accountController.getAccount({_id: accountId})
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/completeInfo', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountCompleteInfo>(async () => {
        return await accountController.getAccountCompleteInfo({_id: accountId})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId', async (req, res) => {
    const { accountId } = req.params
    const { username, disabled, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccount>(async () => {
        return await accountController.updateAccount(accountId, username, disabled, verified)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccount>(async () => {
        return await accountController.deleteAccount(accountId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router