import express from 'express'

import FeatureModel, { IFeature } from '../dataSource/models/featureModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import Config from '../utilities/config'

import featureController from '../controllers/featureController'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiCoreEndpoint + 'features', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const result = await featureController.getFeaturesByPage({}, pageInfo)

    return res.json(result)
})

router.get(env.RootApiCoreEndpoint + 'features/:featureId', async (req, res) => {
    const { featureId } = req.params

    const result = await featureController.getFeature({_id: featureId})

    return res.json(result)
})

router.post(env.RootApiCoreEndpoint + 'features/create', async (req, res) => {
    const featureData = req.body
    const resp = await featureController.saveFeature(featureData)

    return res.json(resp)
})

router.put(env.RootApiCoreEndpoint + 'features/:featureId', async (req, res) => {
    const { featureId } = req.params
    const featureData = req.body
    let resp = null

    if (featureId && featureData) {
        resp = await featureController.updateFeature(featureId, featureData)
    }

    return res.json(resp)
})

router.delete(env.RootApiCoreEndpoint + 'features/:featureId', async (req, res) => {
    const { featureId } = req.params
    let resp = null

    if (featureId) {
        resp = await featureController.deleteFeature(featureId)
    }

    return res.json(resp)
})

export default router