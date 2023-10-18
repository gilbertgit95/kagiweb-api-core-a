import express from 'express'

// import RoleModel, { IWorkspace } from '../dataSource/models/roleModel'
import ErrorHandler from '../utilities/errorHandler'
import DataRequest, {IListOutput}  from '../utilities/dataQuery'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import workspaceController from '../controllers/workspaceController'
import { IWorkspace } from '../dataSource/models/workspaceModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'workspaces', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const [result, statusCode] = await ErrorHandler.execute<IListOutput<IWorkspace>>(async () => {
        return await workspaceController.getWorkspacesByPage({}, pageInfo)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'workspaces', async (req, res) => {
    const { name, level, description } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await workspaceController.saveWorkspace(name, level, description)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'workspaces/:workspaceId', async (req, res) => {
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await workspaceController.getWorkspace({_id: workspaceId})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'workspaces/:workspaceId', async (req:any, res) => {
    const currUserId = req.user._id
    const { workspaceId } = req.params
    const { name, level, description } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {

            return await workspaceController.updateWorkspace(currUserId, workspaceId, name, level, description)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'workspaces/:workspaceId', async (req:any, res) => {
    const currUserId = req.user._id
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await workspaceController.deleteWorkspace(currUserId, workspaceId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router