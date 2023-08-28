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
    customSiteTitle: (appPackageInfo.name || '') + ' Documentation',
    customfavIcon: env.RootAssetsEndpoint + 'logoV2/favicon.ico',
    customCss: theme.getBuffer('dark')
}

swaggerOptions.customCss += `
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
    .btn.btn-sm.json-schema-form-item-remove.null.button {
        margin-left: 10px;
    }
    .inner-object table.model {
        margin-top: 15px;
    }
`

// update some swagger data
// author, title, description, version, license, port, servers
swaggerData.info.title = appPackageInfo.name
swaggerData.info.description = appPackageInfo.description
swaggerData.info.version = appPackageInfo.version
swaggerData.info.contact.name = appPackageInfo.author.name
swaggerData.info.contact.email = appPackageInfo.author.email
swaggerData.info.license.name = appPackageInfo.license
swaggerData.servers = [
    { url: `http://localhost:${ env.AppPort + env.RootApiEndpoint }` }
]

router.use(
    env.RootApiEndpoint + 'apiDoc',
    swaggerUI.serve,
    swaggerUI.setup(
        swaggerData,
        swaggerOptions
    )
)

export default router