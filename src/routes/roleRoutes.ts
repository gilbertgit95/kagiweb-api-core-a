import express from 'express'

// import RoleModel, { IRole } from '../dataSource/models/roleModel'
import ErrorHandler from '../utilities/errorHandler'
import DataRequest, {IListOutput}  from '../utilities/dataQuery'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import roleController from '../controllers/roleController'
import { IRole } from '../dataSource/models/roleModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'roles', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const [result, statusCode] = await ErrorHandler.execute<IListOutput<IRole>>(async () => {
        return await roleController.getRolesByPage({}, pageInfo)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'roles/:roleId', async (req, res) => {
    const { roleId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRole>(async () => {
        return await roleController.getRole({_id: roleId})
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'roles/create', async (req, res) => {
    const roleData = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRole>(async () => {
        return await roleController.saveRole(roleData)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'roles/:roleId', async (req, res) => {
    const { roleId } = req.params
    const roleData = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRole>(async () => {
        if (roleId && roleData) {
            return await roleController.updateRole(roleId, roleData)
        }
        return null
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'roles/:roleId', async (req, res) => {
    const { roleId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRole>(async () => {
        return await roleController.deleteRole(roleId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router