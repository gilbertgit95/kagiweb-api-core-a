import express, { Request, Response } from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'
import DataRequest, {IListOutput} from '../utilities/dataQuery'

import notificationController from '../controllers/notificationController'
import invitationController from '../controllers/invitationController'
import { INotification } from '../dataSource/models/notificationModel'

const router = express.Router()
const env = Config.getEnv()

// for owner notifications
router.put(env.RootApiEndpoint + 'owner/invitations/accountAccess', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { refAccount } = req.body

    const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
        return await invitationController.acceptAccountInvitation(accountId, refAccount)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/invitations/accountAccess', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { refAccount } = req.body

    const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
        return await invitationController.declineAccountInvitation(accountId, refAccount)
    })

    return res.status(statusCode).send(result)
})

// for owner notifications
router.put(env.RootApiEndpoint + 'owner/invitations/workspaceAccess', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { refAccount, refAccountWorkspace } = req.body

    const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
        return await invitationController.acceptAccountWorkspaceInvitation(accountId, refAccount, refAccountWorkspace)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/invitations/workspaceAccess', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { refAccount, refAccountWorkspace } = req.body

    const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
        return await invitationController.declineAccountWorkspaceInvitation(accountId, refAccount, refAccountWorkspace)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router