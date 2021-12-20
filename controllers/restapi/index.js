const express = require('express');
const router = express.Router();

const authRoute = require('./auth/routes');
const accountsRoute = require('./accounts/routes');
const endpointsRoute = require('./endpoints/routes');
const rolesRoute = require('./roles/routes');
const roleEndpointsRoute = require('./roleEndpoints/routes');
const logsRoute = require('./logs/routes');
const apiDocRoute = require('./apiDoc/routes');
const testsRoute = require('./tests/routes');

const accountAccessAndProvider = require('../../middlewares/accountAccessAndProvider');

/**
 * Error message thrown by controllers
 * 
 * @typedef ErrorMessage
 * @property { number } code - error code
 * @property { string } message - error message
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          Error:
 *              type: object
 *              properties:
 *                  defaultMessage:
 *                      type: string
 *                      description: Default error message
 *                  message:
 *                      type: string
 *                      description: Error message
 *              example:
 *                  defaultMessage: Internal Server Error
 *                  message: No name property of undefined
 */

/**
 * public routes
 */

router.use(express.static('public'))
router.use('/assets', express.static('assets'))

/**
 * api for authentications
 */
router.use('/api/v1/auth', authRoute)


/**
 * api documentation
 */
 router.use('/api/', apiDocRoute)


/**
 * secured routes
 */

// middleware to check access and provide
// account information in the request object
router.use(accountAccessAndProvider)

router.use('/api/v1', accountsRoute)
router.use('/api/v1', endpointsRoute)
router.use('/api/v1', rolesRoute)
router.use('/api/v1', roleEndpointsRoute)
router.use('/api/v1', logsRoute)

/**
 * test routes
 */
router.use('/api/v1', testsRoute)

module.exports = router
