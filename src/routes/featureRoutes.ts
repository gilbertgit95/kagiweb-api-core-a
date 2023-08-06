import express from 'express'

// import FeatureModel, { IFeature } from '../dataSource/models/featureModel'
import ErrorHandler from '../utilities/errorHandler'
import DataRequest, {IListOutput} from '../utilities/dataQuery'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import featureController from '../controllers/featureController'
import { IFeature } from '../dataSource/models/featureModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'features', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const [result, statusCode] = await ErrorHandler.execute<IListOutput<IFeature>>(async () => {
        return await featureController.getFeaturesByPage({}, pageInfo)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'features/:featureId', async (req, res) => {
    const { featureId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IFeature>(async () => {
        // return = await featureController.getFeature({_id: featureId})
        return null
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'features/create', async (req, res) => {
    const featureData = req.body

    const [result, statusCode] = await ErrorHandler.execute<IFeature>(async () => {
        // return = await featureController.saveFeature(featureData)

        return null
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'features/:featureId', async (req, res) => {
    const { featureId } = req.params
    const featureData = req.body

    const [result, statusCode] = await ErrorHandler.execute<IFeature>(async () => {
        if (featureId && featureData) {
           return await featureController.updateFeature(featureId, featureData)
        }
        return null
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'features/:featureId', async (req, res) => {
    const { featureId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<string>(async () => {
        if (featureId) {
            return await featureController.deleteFeature(featureId)
        }
        return null
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router