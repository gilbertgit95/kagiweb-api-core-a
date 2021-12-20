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

// initial constants
const ROOT_DOCS = process.env.ROOT_REST_DOCS || '/api/documentation';
const ROOT_REST = process.env.ROOT_REST || '/api/v1';

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
 * api documentation
 */
 router.use(ROOT_DOCS, apiDocRoute)

/**
 * api for authentications
 */
router.use(`${ ROOT_REST }/auth`, authRoute)


/**
 * secured routes
 */

// middleware to check access and provide
// account information in the request object
router.use(accountAccessAndProvider)

router.use(ROOT_REST, accountsRoute)
router.use(ROOT_REST, endpointsRoute)
router.use(ROOT_REST, rolesRoute)
router.use(ROOT_REST, roleEndpointsRoute)
router.use(ROOT_REST, logsRoute)

/**
 * test routes
 */
router.use(ROOT_REST, testsRoute)

module.exports = router
