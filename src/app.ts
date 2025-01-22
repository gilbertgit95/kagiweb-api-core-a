import express from 'express'
import requestIP from 'request-ip'
import bodyParser from 'body-parser'
import cors from 'cors'

import Config from './utilities/config'
import appEvents from './utilities/appEvents'

import clientInfoProvider from './middlewares/clientInfoProviderMiddleware'
import accountInfoAndAccessProvider from './middlewares/accountInfoAndAccessProviderMiddleware'

import documentationRoutes from './routes/documentationRoutes'
import authRoutes from './routes/authRoutes'
import systemInfoRoutes from './routes/systemInfoRoutes'
import featureRoutes from './routes/featureRoutes'
import roleRoutes from './routes/roleRoutes'
import roleFeatureRoutes from './routes/roleFeatureRoutes'
import accountRoutes from './routes/accountRoutes'
import accountRoleRoutes from './routes/accountRoleRoutes'
import accountAccountInfoRoutes from './routes/accountAccountInfoRoutes'
import accountAccountConfigRoutes from './routes/accountAccountConfigRoutes'
import accountContactInfoRoutes from './routes/accountContactInfoRoutes'
import accountPasswordRoutes from './routes/accountPasswordRoutes'
import accountLimitedTransactionRoutes from './routes/accountLimitedTransactionRoutes'
import accountClientDeviceRoutes from './routes/accountClientDeviceRoutes'
import accountClientDeviceAccesstokenRoutes from './routes/accountClientDeviceAccesstokenRoutes'
import accountAccountRefRoutes from './routes/accountAccountRefRoutes'
import accountAccountRefAccountConfigRoutes from './routes/accountAccountRefAccountConfigRoutes'
import accountAccountRefRoleRoutes from './routes/accountAccountRefRoleRoutes'
import accountWorkspaceRoutes from './routes/accountWorkspaceRoutes'
import accountWorkspaceAccountRefRoutes from './routes/accountWorkspaceAccountRefRoutes'
import accountWorkspaceAccountRefAccountConfigRoutes from './routes/accountWorkspaceAccountRefAccountConfigRoutes'
import accountWorkspaceAccountRefRoleRoutes from './routes/accountWorkspaceAccountRefRoleRoutes'
import ownerRoutes from './routes/ownerRoutes'

const router = express.Router()
const env = Config.getEnv()

import routerIdentity from './utilities/routerIdentity'
import AppHandler from './utilities/appHandler'
// export default express().use(routes)

const appHandler = new AppHandler()

// register post methods to execute
appHandler.addPostDBConnectionProcess(async () => {
    await routerIdentity.syncAppRoutes() // enable only if you want to sync routes
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
appHandler.addPrivateMiddleware(accountInfoAndAccessProvider)
// private routes
appHandler.addPrivateRoute(systemInfoRoutes)
appHandler.addPrivateRoute(featureRoutes)
appHandler.addPrivateRoute(roleRoutes)
appHandler.addPrivateRoute(roleFeatureRoutes)
appHandler.addPrivateRoute(accountRoutes)
appHandler.addPrivateRoute(accountRoleRoutes)
appHandler.addPrivateRoute(accountAccountInfoRoutes)
appHandler.addPrivateRoute(accountAccountConfigRoutes)
appHandler.addPrivateRoute(accountContactInfoRoutes)
appHandler.addPrivateRoute(accountPasswordRoutes)
appHandler.addPrivateRoute(accountLimitedTransactionRoutes)
appHandler.addPrivateRoute(accountClientDeviceRoutes)
appHandler.addPrivateRoute(accountClientDeviceAccesstokenRoutes)
appHandler.addPrivateRoute(accountWorkspaceRoutes)
appHandler.addPrivateRoute(accountWorkspaceAccountRefRoutes)
appHandler.addPrivateRoute(accountWorkspaceAccountRefAccountConfigRoutes)
appHandler.addPrivateRoute(accountWorkspaceAccountRefRoleRoutes)
appHandler.addPrivateRoute(accountAccountRefRoutes)
appHandler.addPrivateRoute(accountAccountRefAccountConfigRoutes)
appHandler.addPrivateRoute(accountAccountRefRoleRoutes)
appHandler.addPrivateRoute(ownerRoutes)

export {
    appEvents
}
export default appHandler