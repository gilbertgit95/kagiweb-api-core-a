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
router.get(env.RootApiEndpoint + 'accounts/:accountId/notifications', async (req:Request, res) => {
    const { accountId } = req.params
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const [result, statusCode] = await ErrorHandler.execute<IListOutput<INotification>>(async () => {
        return await notificationController.getNotificationsByPage({accountId}, pageInfo)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/notifications', async (req:Request, res) => {
    const { accountId } = req.params
    const { type, title, message, link } = req.body

    const [result, statusCode] = await ErrorHandler.execute<INotification>(async () => {
        return await notificationController.saveNotification(accountId, type, title, message, link)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/notifications/:notificationId', async (req:Request, res) => {
    const { accountId, notificationId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<INotification>(async () => {
        return await notificationController.getNotification({_id: notificationId})
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/notifications/:notificationId', async (req:Request, res) => {
   const { accountId, notificationId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<INotification>(async () => {
        return await notificationController.deleteNotification( notificationId )
    })

    return res.status(statusCode).send(result)
})

// for owner notifications
router.get(env.RootApiEndpoint + 'owner/notifications', async (req:Request, res) => {
    const accountId = req?.accountData?._id || ''
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const [result, statusCode] = await ErrorHandler.execute<IListOutput<INotification>>(async () => {
        return await notificationController.getNotificationsByPage({accountId}, pageInfo)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/notifications', async (req:Request, res) => {
    const accountId = req?.accountData?._id || ''
    const { type, title, message, link } = req.body

    const [result, statusCode] = await ErrorHandler.execute<INotification>(async () => {
        return await notificationController.saveNotification(accountId, type, title, message, link)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/notifications/:notificationId', async (req:Request, res) => {
    const accountId = req?.accountData?._id || ''
    const { notificationId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<INotification>(async () => {
        return await notificationController.getNotification(notificationId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/notifications/:notificationId', async (req:Request, res) => {
    const accountId = req?.accountData?._id || ''
    const { notificationId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<INotification>(async () => {
        return await notificationController.deleteNotification( notificationId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router