import express from 'express'
import swaggerUI from 'swagger-ui-express'
import { SwaggerTheme } from 'swagger-themes'

import Config from '../utilities/config'
import swaggerData from '../../docs/swaggerDocsBuild.json'
import appPackageInfo from '../../package.json'

const router = express.Router()
const env = Config.getEnv()

// theme for swagger ui
const theme = new SwaggerTheme('v3') // Specifying the Swagger Version
const swaggerOptions = {
    // explorer: true,
    customCss: theme.getBuffer('dark')
}
const customStyle = {
    customSiteTitle: (appPackageInfo.name || '') + ' Documentation',
    customfavIcon: '/assets/favicon.png',
    customCss: `
        .swagger-ui .topbar {
            display: none;
        }

        .swagger-ui button.models-control:focus {
            outline: none;
        }
        .swagger-ui .model-box-control:focus {
            outline: none;
        }
        .swagger-ui .opblock-summary-control:focus {
            outline: none;
        }
        .inner-object table.model {
            margin-top: 15px;
        }
    `
}

// update some swagger data
// author, title, description, version, license, port, servers
swaggerData.info.title = appPackageInfo.name
swaggerData.info.description = appPackageInfo.description
swaggerData.info.version = appPackageInfo.version
swaggerData.info.contact.name = appPackageInfo.author.name
swaggerData.info.contact.email = appPackageInfo.author.email
swaggerData.info.license.name = appPackageInfo.license
swaggerData.servers = [
    { url: `http://localhost:${ env.AppPort + env.RootApiCoreEndpoint }` }
]

router.use(
    env.RootApiCoreEndpoint + 'apiDoc',
    swaggerUI.serve,
    swaggerUI.setup(
        swaggerData,
        swaggerOptions,
        customStyle
    )
)

export default router