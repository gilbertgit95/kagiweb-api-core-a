import express from 'express'

// import RoleModel, { IRole } from '../dataSource/models/roleModel'
import DataRequest  from '../utilities/dataQuery'
import Config from '../utilities/config'

import roleController from '../controllers/roleController'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'roles', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const result = await roleController.getRolesByPage({}, pageInfo)

    return res.json(result)
})

router.get(env.RootApiEndpoint + 'roles/:roleId', async (req, res) => {
    const { roleId } = req.params

    const result = await roleController.getRole({_id: roleId})

    return res.json(result)
})

router.post(env.RootApiEndpoint + 'roles/create', async (req, res) => {
    const roleData = req.body
    const resp = await roleController.saveRole(roleData)

    return res.json(resp)
})

router.put(env.RootApiEndpoint + 'roles/:roleId', async (req, res) => {
    const { roleId } = req.params
    const roleData = req.body
    let resp = null

    if (roleId && roleData) {
        resp = await roleController.updateRole(roleId, roleData)
    }

    return res.json(resp)
})

router.delete(env.RootApiEndpoint + 'roles/:roleId', async (req, res) => {
    const { roleId } = req.params
    let resp = null

    if (roleId) {
        resp = await roleController.deleteRole(roleId)
    }

    return res.json(resp)
})

export default router