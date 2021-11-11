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
                url: `http://localhost:${ process.env.PORT || 3000 }`
            }
        ]
    },
    apis: ['./controllers/*/*.js']
}

const swaggerJsDocSpec = swaggerJsDoc(options)

module.exports = {
    swaggerUI,
    swaggerJsDocSpec
}