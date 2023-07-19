import express from 'express'
import requestIP from 'request-ip'
import bodyParser from 'body-parser'

import Config from '../utilities/config'

import clientInfoProvider from '../middlewares/clientInfoProviderMiddleware'
import userInfoProvider from '../middlewares/userInfoProviderMiddleware'
import accessChecker from '../middlewares/accessCheckerMiddleware'

import documentationRoutes from './documentationRoutes'
import authRoutes from './authRoutes'
import systemInfo from './systemInfoRoutes'
import featureRoutes from './featureRoutes'
import roleRoutes from './roleRoutes'
import userRoutes from './userRoutes'

const router = express.Router()
const env = Config.getEnv()

// public routes for static files
router.get(env.RootWebappEndpoint, express.static(env.RootWebappDir))
router.use(documentationRoutes)

// middlewares executed when accessing routes including auths
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
router.use(systemInfo)
router.use(featureRoutes)
router.use(roleRoutes)
router.use(userRoutes)

export default router