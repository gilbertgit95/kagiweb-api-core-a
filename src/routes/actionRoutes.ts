import express, { Request, Response } from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'
import actionController from '../controllers/actionsController'

const router = express.Router()
const env = Config.getEnv()

// account
// accounts/37410e75-1760-4bb6-85e0-d0a138d374bc/actions/invitation/module/accounts/d5c52e70-a40a-421a-8b14-cc0cfa595c24/ref/accountRefs/5546e098-7604-4d50-adea-66eafa1c1ae3
// accounts/37410e75-1760-4bb6-85e0-d0a138d374bc/actions/invitation/module/accounts/d5c52e70-a40a-421a-8b14-cc0cfa595c24/subModule/workspaces/b6fa7ceb-71d0-4e49-bd86-422849727811/ref/accountRefs/600c5220-cc88-43d4-8485-ad69d9e8f633
router.get(env.RootApiEndpoint + 'accounts/:accountId/actions/:actionType/module/:moduleType/:moduleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const { accountId, actionType, moduleType, moduleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.getAccountActionInfo(accountId, actionType, moduleType, moduleId, refType, refId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/actions/:actionType/module/:moduleType/:moduleId/subModule/:subModuleType/:subModuleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const { accountId, actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.getAccountWorkspaceActionInfo(accountId, actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/actions/:actionType/module/:moduleType/:moduleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const { accountId, actionType, moduleType, moduleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.acceptOrDeclineAccountAction(accountId, actionType, moduleType, moduleId, refType, refId, true)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/actions/:actionType/module/:moduleType/:moduleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const { accountId, actionType, moduleType, moduleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.acceptOrDeclineAccountAction(accountId, actionType, moduleType, moduleId, refType, refId, false)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/actions/:actionType/module/:moduleType/:moduleId/subModule/:subModuleType/:subModuleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const { accountId, actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.acceptOrDeclineAccountWorkspaceAction(accountId, actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId, true)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/actions/:actionType/module/:moduleType/:moduleId/subModule/:subModuleType/:subModuleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const { accountId, actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.acceptOrDeclineAccountWorkspaceAction(accountId, actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId, false)
    })

    return res.status(statusCode).send(result)
})

// owner
router.get(env.RootApiEndpoint + 'owner/actions/:actionType/module/:moduleType/:moduleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { actionType, moduleType, moduleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.getAccountActionInfo(accountId, actionType, moduleType, moduleId, refType, refId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/actions/:actionType/module/:moduleType/:moduleId/subModule/:subModuleType/:subModuleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.getAccountWorkspaceActionInfo(accountId, actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/actions/:actionType/module/:moduleType/:moduleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { actionType, moduleType, moduleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        if (actionType === 'Action' && moduleType === 'account') {
            return await actionController.acceptOrDeclineAccountAction(accountId, actionType, moduleType, moduleId, refType, refId, true)
        }

        throw({code: 404})
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/actions/:actionType/module/:moduleType/:moduleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { actionType, moduleType, moduleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.acceptOrDeclineAccountAction(accountId, actionType, moduleType, moduleId, refType, refId, false)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/actions/:actionType/module/:moduleType/:moduleId/subModule/:subModuleType/:subModuleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.acceptOrDeclineAccountWorkspaceAction(accountId, actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId, true)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/actions/:actionType/module/:moduleType/:moduleId/subModule/:subModuleType/:subModuleId/ref/:refType/:refId', async (req:Request, res:Response) => {
    const accountId = req?.accountData?._id || ''
    const { actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<any>(async () => {
        return await actionController.acceptOrDeclineAccountWorkspaceAction(accountId, actionType, moduleType, moduleId, subModuleType, subModuleId, refType, refId, false)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router