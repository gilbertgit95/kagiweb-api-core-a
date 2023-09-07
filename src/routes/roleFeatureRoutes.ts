import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import roleFeatureController from '../controllers/roleFeatureController'
import { IFeatureRef } from '../dataSource/models/roleModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'roles/:roleId/features', async (req, res) => {
    const { roleId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IFeatureRef[]>(async () => {
        return await roleFeatureController.getFeatureRefs(roleId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'roles/:roleId/features/', async (req, res) => {
    const { roleId } = req.params
    const { featureId } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IFeatureRef>(async () => {
        return await roleFeatureController.saveFeatureRef(roleId, featureId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'roles/:roleId/features/:featureRefId', async (req, res) => {
    const { roleId, featureRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IFeatureRef>(async () => {
        return await roleFeatureController.getFeatureRef(roleId, featureRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'roles/:roleId/features/:featureRefId', async (req, res) => {
    const { roleId, featureRefId } = req.params
    const { featureId } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IFeatureRef>(async () => {
        return await roleFeatureController.updateFeatureRef(roleId, featureRefId, featureId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'roles/:roleId/features/:featureRefId', async (req, res) => {
    const { roleId, featureRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IFeatureRef>(async () => {
        return await roleFeatureController.deleteFeatureRef(roleId, featureRefId)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router