const router = require('express').Router();
const { swaggerUI, swaggerJsDocSpec, customStyle } = require('./apiDoc');

router.use(
    '/documentation',
    swaggerUI.serve,
    swaggerUI.setup(swaggerJsDocSpec, customStyle)
)

module.exports = router