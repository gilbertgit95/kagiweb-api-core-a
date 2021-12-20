const express = require('express');
const router = express.Router();
const { swaggerUI, swaggerJsDocSpec, customStyle } = require('./apiDoc');

// initial constants
const ENV = process.env.NODE_ENV || 'development';

// only add doc routes if the environment is not in production mode
if (ENV != 'production') {
    // swagger generated pages
    router.use(
        '/rest',
        swaggerUI.serve,
        swaggerUI.setup(swaggerJsDocSpec, customStyle)
    )

    // jsdoc generated pages
    router.use(
        '/core',
        express.static('controllers/restapi/apiDoc/jsdoc')
    )
}

module.exports = router