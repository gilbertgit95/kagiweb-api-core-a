const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const packageJSON = require(__dirname + '/../../package.json');

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
    apis: ['./controllers/index.js', './controllers/*/routes.js']
}

const swaggerJsDocSpec = swaggerJsDoc(options)

module.exports = {
    swaggerUI,
    swaggerJsDocSpec
}