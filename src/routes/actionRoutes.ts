import express, { Request, Response } from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'
import actionController from '../controllers/actionsController'

const router = express.Router()
const env = Config.getEnv()

router.put(env.RootApiEndpoint + 'owner/actions/:actionType/module/:moduleType/:moduleId/ref/:refId', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { actionType, moduleType, moduleId, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
        if (actionType === 'invitation' && moduleType === 'account') {
            return await actionController.acceptAccountInvitation(accountId, moduleId, refId)
        }

        throw({code: 404})
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/actions/:actionType/module/:moduleType/:moduleId/ref/:refId', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { actionType, moduleType, moduleId, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
        if (actionType === 'invitation' && moduleType === 'account') {
            return await actionController.declineAccountInvitation(accountId, moduleId, refId)
        }

        throw({code: 404})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/actions/:actionType/module/:moduleType/:moduleId/subModule/:subModuleType/:subModuleId/ref/:refId', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { actionType, moduleType, moduleId, subModuleType, subModuleId, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
        if (actionType === 'invitation' && moduleType === 'account' && subModuleType === 'workspace') {
            return await actionController.acceptAccountWorkspaceInvitation(accountId, moduleId, subModuleId, refId)
        }

        throw({code: 404})
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/actions/:actionType/module/:moduleType/:moduleId/subModule/:subModuleType/:subModuleId/ref/:refId', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { actionType, moduleType, moduleId, subModuleType, subModuleId, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
        if (actionType === 'invitation' && moduleType === 'account' && subModuleType === 'workspace') {
            return await actionController.declineAccountWorkspaceInvitation(accountId, moduleId, subModuleId, refId)
        }

        throw({code: 404})
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router