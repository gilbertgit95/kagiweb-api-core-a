import express from 'express'
import swaggerUI from 'swagger-ui-express'

import Config from '../utilities/config'
import swaggerData from '../../docs/swaggerDocs/index.json'
import appPackageInfo from '../../package.json'

const router = express.Router()
const env = Config.getEnv()

// update some swagger data
// author, title, description, version, license, port, basePath
swaggerData.info.title = appPackageInfo.name
swaggerData.info.description = appPackageInfo.description
swaggerData.info.version = appPackageInfo.version
swaggerData.info.contact.name = appPackageInfo.author.name
swaggerData.info.contact.email = appPackageInfo.author.email
swaggerData.info.license.name = appPackageInfo.license
swaggerData.host = `localhost:${ env.AppPort }`
swaggerData.basePath = env.RootApiCoreEndpoint

router.use(env.RootApiCoreEndpoint + 'apiDoc', swaggerUI.serve, swaggerUI.setup(swaggerData))

export default router