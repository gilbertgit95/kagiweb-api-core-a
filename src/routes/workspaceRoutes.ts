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
const isGlobal = true

router.get(env.RootApiEndpoint + 'workspaces', async (req:any, res) => {
    const currLoggedUser = req?.userData?._id
    const pageInfo = DataRequest.getPageInfoQuery(req.query)
    const query:{owner?:any} = {}

    if (req.query.owner) query.owner = req.query.owner

    const [result, statusCode] = await ErrorHandler.execute<IListOutput<IWorkspace>>(async () => {
        return await workspaceController.getWorkspacesByPage(isGlobal, currLoggedUser)(query, pageInfo)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'workspaces', async (req:any, res) => {
    const currLoggedUser = req?.userData?._id
    const { owner, name, description, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await workspaceController.saveWorkspace(isGlobal, currLoggedUser)(owner, name, description, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'workspaces/:workspaceId', async (req:any, res) => {
    const currLoggedUser = req?.userData?._id
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await workspaceController.getWorkspace(isGlobal, currLoggedUser)({_id: workspaceId})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'workspaces/:workspaceId', async (req:any, res) => {
    const currLoggedUser = req?.userData?._id
    const { workspaceId } = req.params
    const { owner, name, description,disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {

            return await workspaceController.updateWorkspace(isGlobal, currLoggedUser)(workspaceId, owner, name, description, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'workspaces/:workspaceId', async (req:any, res) => {
    const currLoggedUser = req?.userData?._id
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await workspaceController.deleteWorkspace(isGlobal, currLoggedUser)(workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'workspaces/:workspaceId/select/owner/:owner', async (req:any, res) => {
    const currLoggedUser = req?.userData?._id
    const { workspaceId, owner } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace[]>(async () => {
        return await workspaceController.selectOwnerWorkspace(isGlobal, currLoggedUser)(workspaceId, owner)
    })

    return res.status(statusCode).send(result)
})


routerIdentity.addAppRouteObj(router)
export default router