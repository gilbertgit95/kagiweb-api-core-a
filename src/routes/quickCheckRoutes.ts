import express, { Request, Response } from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'
import DataRequest, {IListOutput} from '../utilities/dataQuery'

import notificationController from '../controllers/notificationController'
import { INotification } from '../dataSource/models/notificationModel'

const router = express.Router()
const env = Config.getEnv()

// for account notifications
router.get(env.RootApiEndpoint + 'accounts/:accountId/quickCheck/activeNotifications', async (req:Request, res:Response) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<{activeNotifications: number}>(async () => {
        return await notificationController.getActiveNotifications(accountId)
    })

    return res.status(statusCode).send(result)
})

// for owner notifications
router.get(env.RootApiEndpoint + 'owner/quickCheck/activeNotifications', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''

    const [result, statusCode] = await ErrorHandler.execute<{activeNotifications: number}>(async () => {
        return await notificationController.getActiveNotifications(accountId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router