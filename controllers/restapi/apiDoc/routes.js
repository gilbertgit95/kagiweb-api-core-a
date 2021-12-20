const express = require('express');
const router = express.Router();
const { swaggerUI, swaggerJsDocSpec, customStyle } = require('./apiDoc');

// only add doc routes if the environment is not in production
if (process.env.NODE_ENV && process.env.NODE_ENV != 'production') {
    // swagger generated pages
    router.use(
        '/documentation/rest',
        swaggerUI.serve,
        swaggerUI.setup(swaggerJsDocSpec, customStyle)
    )

    // jsdoc generated pages
    router.use(
        '/documentation/core',
        express.static('controllers/restapi/apiDoc/jsdoc')
    )
}

module.exports = router