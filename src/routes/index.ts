import express from 'express'
import requestIP from 'request-ip'
import bodyParser from 'body-parser'
import cors from 'cors'

import Config from '../utilities/config'

import clientInfoProvider from '../middlewares/clientInfoProviderMiddleware'
import userInfoProvider from '../middlewares/userInfoProviderMiddleware'
import accessChecker from '../middlewares/accessCheckerMiddleware'

import documentationRoutes from './documentationRoutes'
import authRoutes from './authRoutes'
import systemInfo from './systemInfoRoutes'
import featureRoutes from './featureRoutes'
import roleRoutes from './roleRoutes'
import roleFeatureRoutes from './roleFeatureRoutes'
import userRoutes from './userRoutes'
import ownerRoutes from './ownerRoutes'

const router = express.Router()
const env = Config.getEnv()

// public routes for webapp files, api assets and api documentation
router.use(env.RootWebappEndpoint, express.static(env.RootWebappDir))
router.use(env.RootAssetsEndpoint, express.static(env.RootAssetsDir))
router.use(documentationRoutes)

// middlewares executed when accessing routes including auths
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(requestIP.mw())
router.use(clientInfoProvider)

// public routes without authorization
router.use(authRoutes)

// add middlewares for secured routes
router.use(userInfoProvider)
router.use(accessChecker)

// routes for data api needs authorization
router.use(ownerRoutes)
router.use(systemInfo)
router.use(featureRoutes)

router.use(roleRoutes)
router.use(roleFeatureRoutes)

router.use(userRoutes)


export default router