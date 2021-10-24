const express = require('express');
const router = express.Router();

const authRoute = require('./auth/routes');
const accountsRoute = require('./accounts/routes');
const endpointsRoute = require('./endpoints/routes');
const rolesRoute = require('./roles/routes');
const testsRoute = require('./tests/routes');

const accountAccessAndProvider = require('./../middlewares/accountAccessAndProvider');

/**
 * public routes
 */

// for static files
router.use(express.static('public'))
router.use('/assets', express.static('assets'))

// for authentication
router.use('/api/v1/auth', authRoute)


/**
 * secured routes
 */

// middleware to check access and provide
// account information in the request object
router.use(accountAccessAndProvider)

router.use('/api/v1', accountsRoute)
router.use('/api/v1', endpointsRoute)
router.use('/api/v1', rolesRoute)

/**
 * test routes
 */
router.use('/api/v1', testsRoute)

module.exports = router
