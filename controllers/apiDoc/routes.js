const express = require('express');
const router = express.Router();
const { swaggerUI, swaggerJsDocSpec, customStyle } = require('./apiDoc');

// swagger generated pages
router.use(
    '/documentation/rest',
    swaggerUI.serve,
    swaggerUI.setup(swaggerJsDocSpec, customStyle)
)

// jsdoc generated pages
router.use(
    '/documentation/core',
    express.static('controllers/apiDoc/jsdoc')
)

module.exports = router