import express from 'express'
import requestIP from 'request-ip'
import bodyParser from 'body-parser'
import cors from 'cors'

import Config from './utilities/config'
import appEvents from './utilities/appEvents'

import clientInfoProvider from './middlewares/clientInfoProviderMiddleware'
import userInfoAndAccessProvider from './middlewares/accountInfoAndAccessProviderMiddleware'

import documentationRoutes from './routes/documentationRoutes'
import authRoutes from './routes/authRoutes'
import systemInfoRoutes from './routes/systemInfoRoutes'
import featureRoutes from './routes/featureRoutes'
import roleRoutes from './routes/roleRoutes'
import roleFeatureRoutes from './routes/roleFeatureRoutes'
import userRoutes from './routes/accountRoutes'
import userRoleRoutes from './routes/accountRoleRoutes'
import userUserInfoRoutes from './routes/accountAccountInfoRoutes'
import userContactInfoRoutes from './routes/accountContactInfoRoutes'
import userPasswordRoutes from './routes/accountPasswordRoutes'
import userLimitedTransactionRoutes from './routes/accountLimitedTransactionRoutes'
import userClientDeviceRoutes from './routes/accountClientDeviceRoutes'
import userClientDeviceAccesstokenRoutes from './routes/accountClientDeviceAccesstokenRoutes'
import userWorkspaceRoutes from './routes/accountWorkspaceRoutes'
import accountWorkspaceAccountRefRoutes from './routes/accountWorkspaceAccountRefRoutes'
import ownerRoutes from './routes/ownerRoutes'

const router = express.Router()
const env = Config.getEnv()

// import routerIdentity from './utilities/routerIdentity'
import AppHandler from './utilities/appHandler'
// export default express().use(routes)

const appHandler = new AppHandler()

// register post methods to execute
appHandler.addPostDBConnectionProcess(async () => {
    // await routerIdentity.syncAppRoutes() // enable only if you want to sync routes
})

// public routes for webapp files, api assets and api documentation
appHandler.addPublicStaticRoute(router.use(env.RootWebappEndpoint, express.static(env.RootWebappDir)))
appHandler.addPublicStaticRoute(router.use(env.RootAssetsEndpoint, express.static(env.RootAssetsDir)))
appHandler.addPublicStaticRoute(documentationRoutes)

// middlewares executed when accessing routes including auths
appHandler.addPublicMiddleware(cors())
appHandler.addPublicMiddleware(bodyParser.json())
appHandler.addPublicMiddleware(bodyParser.urlencoded({ extended: true }))
appHandler.addPublicMiddleware(requestIP.mw())
appHandler.addPublicMiddleware(clientInfoProvider)

// public routes without authorization
appHandler.addPublicRoute(authRoutes)

// add middlewares for secured routes
// routes for data api needs authorization
appHandler.addPrivateMiddleware(userInfoAndAccessProvider)
// private routes
appHandler.addPrivateRoute(systemInfoRoutes)
appHandler.addPrivateRoute(featureRoutes)
appHandler.addPrivateRoute(roleRoutes)
appHandler.addPrivateRoute(roleFeatureRoutes)
appHandler.addPrivateRoute(userRoutes)
appHandler.addPrivateRoute(userRoleRoutes)
appHandler.addPrivateRoute(userUserInfoRoutes)
appHandler.addPrivateRoute(userContactInfoRoutes)
appHandler.addPrivateRoute(userPasswordRoutes)
appHandler.addPrivateRoute(userLimitedTransactionRoutes)
appHandler.addPrivateRoute(userClientDeviceRoutes)
appHandler.addPrivateRoute(userClientDeviceAccesstokenRoutes)
appHandler.addPrivateRoute(userWorkspaceRoutes)
appHandler.addPrivateRoute(accountWorkspaceAccountRefRoutes)
appHandler.addPrivateRoute(ownerRoutes)

export {
    appEvents
}
export default appHandler