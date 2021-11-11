const router = require('express').Router();
const { swaggerUI, swaggerJsDocSpec } = require('./apiDoc');

router.use(
    '/documentation',
    swaggerUI.serve,
    swaggerUI.setup(swaggerJsDocSpec)
)

module.exports = router