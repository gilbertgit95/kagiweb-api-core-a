import express from 'express'
import requestIP from 'request-ip'
import bodyParser from 'body-parser'
import cors from 'cors'

import Config from './utilities/config'

import clientInfoProvider from './middlewares/clientInfoProviderMiddleware'
import userInfoAndAccessProvider from './middlewares/userInfoAndAccessProviderMiddleware'

import documentationRoutes from './routes/documentationRoutes'
import authRoutes from './routes/authRoutes'
import systemInfoRoutes from './routes/systemInfoRoutes'
import featureRoutes from './routes/featureRoutes'
import roleRoutes from './routes/roleRoutes'
import roleFeatureRoutes from './routes/roleFeatureRoutes'
import userRoutes from './routes/userRoutes'
import userRoleRoutes from './routes/userRoleRoutes'
import userUserInfoRoutes from './routes/userUserInfoRoutes'
import userContactInfoRoutes from './routes/userContactInfoRoutes'
import userPasswordRoutes from './routes/userPasswordRoutes'
import userLimitedTransactionRoutes from './routes/userLimitedTransactionRoutes'
import userClientDeviceRoutes from './routes/userClientDeviceRoutes'
import userClientDeviceAccesstokenRoutes from './routes/userClientDeviceAccesstokenRoutes'
import ownerRoutes from './routes/ownerRoutes'

const router = express.Router()
const env = Config.getEnv()

import RouterHandler, {routerIdentity} from './utilities/routerHandler'
// export default express().use(routes)

const routerHandler = new RouterHandler()

// register post methods to execute
routerHandler.addPostDBConnectionProcess(async () => {
    await routerIdentity.syncAppRoutes()
})

// public routes for webapp files, api assets and api documentation
routerHandler.addPublicStaticRoute(router.use(env.RootWebappEndpoint, express.static(env.RootWebappDir)))
routerHandler.addPublicStaticRoute(router.use(env.RootAssetsEndpoint, express.static(env.RootAssetsDir)))
routerHandler.addPublicStaticRoute(documentationRoutes)

// middlewares executed when accessing routes including auths
routerHandler.addPublicMiddleware(cors())
routerHandler.addPublicMiddleware(bodyParser.json())
routerHandler.addPublicMiddleware(bodyParser.urlencoded({ extended: true }))
routerHandler.addPublicMiddleware(requestIP.mw())
routerHandler.addPublicMiddleware(clientInfoProvider)

// public routes without authorization
routerHandler.addPublicRoute(authRoutes)

// add middlewares for secured routes
// routes for data api needs authorization
routerHandler.addPrivateMiddleware(userInfoAndAccessProvider)
// private routes
routerHandler.addPrivateRoute(systemInfoRoutes)
routerHandler.addPrivateRoute(featureRoutes)
routerHandler.addPrivateRoute(roleRoutes)
routerHandler.addPrivateRoute(roleFeatureRoutes)
routerHandler.addPrivateRoute(userRoutes)
routerHandler.addPrivateRoute(userRoleRoutes)
routerHandler.addPrivateRoute(userUserInfoRoutes)
routerHandler.addPrivateRoute(userContactInfoRoutes)
routerHandler.addPrivateRoute(userPasswordRoutes)
routerHandler.addPrivateRoute(userLimitedTransactionRoutes)
routerHandler.addPrivateRoute(userClientDeviceRoutes)
routerHandler.addPrivateRoute(userClientDeviceAccesstokenRoutes)
routerHandler.addPrivateRoute(ownerRoutes)

export default routerHandler