import express from 'express'

// import accountModel, { IAccount } from '../dataSource/models/accountModel'
import ErrorHandler from '../utilities/errorHandler'
import DataRequest, {IListOutput} from '../utilities/dataQuery'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import accountController, { IAccessInfo } from '../controllers/accountController'
import { IAccount } from '../dataSource/models/accountModel'
import { IRole } from '../dataSource/models/roleModel'
import { IFeature } from '../dataSource/models/featureModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)
    const accountId = req?.accountData?._id || ''
    const role = req?.appRole
    const query = role?.absoluteAuthority? {}: {
        'accountRefs.accountId': accountId,
        'accountRefs.accepted': true,
        'accountRefs.declined': false,
        'accountRefs.disabled': false
    }

    const [result, statusCode] = await ErrorHandler.execute<IListOutput<IAccount>>(async () => {
        return await accountController.getAccountsByPage(query, pageInfo)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts', async (req, res) => {
    const { nameId, disabled, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccount>(async () => {
        return await accountController.saveAccount(nameId, disabled, verified)
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

router.get(env.RootApiEndpoint + 'accounts/:accountId/accessInfo', async (req, res) => {
    const { accountId } = req.params
    const ua = req.userAgentInfo?.ua
    const token = req.accessToken || undefined

    const [result, statusCode] = await ErrorHandler.execute<IAccessInfo>(async () => {
        return await accountController.getAccountCompleteInfo({_id: accountId, ua, token})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId', async (req, res) => {
    const { accountId } = req.params
    const { nameId, disabled, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccount>(async () => {
        return await accountController.updateAccount(accountId, nameId, disabled, verified)
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