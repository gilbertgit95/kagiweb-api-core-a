const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const packageJSON = require(__dirname + '/../../../package.json');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title:       packageJSON.name || '',
            version:     packageJSON.version || '',
            description: packageJSON.description || ''
        },
        servers: [
            {
                description: 'Local Development Server',
                url: `http://localhost:${ process.env.PORT || 3000 }`
            }
        ]
    },
    // components: {
    //     securitySchemes: {
    //         BearerAuth: {
    //             type: 'http',
    //             scheme: 'bearer'
    //         }
    //     },
    // },
    // security: [
    //     {
    //         BearerAuth: [],
    //     }
    // ],
    apis: ['./controllers/restapi/index.js', './controllers/restapi/*/routes.js']
}

const customStyle = {
    customSiteTitle: (packageJSON.name || '') + ' Documentation',
    customfavIcon: "/assets/favicon.png",
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

const swaggerJsDocSpec = swaggerJsDoc(options)

module.exports = {
    swaggerUI,
    swaggerJsDocSpec,
    customStyle
}