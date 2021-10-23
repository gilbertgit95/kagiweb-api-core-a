const express = require('express');
const router = express.Router();

const accountsRoute = require('./accounts/routes');
const endpointsRoute = require('./endpoints/routes');
const rolesRoute = require('./roles/routes');

// public routes
router.use(express.static('public'))
router.use('/assets', express.static('assets'))

// secured routes
router.use('/api/v1', accountsRoute)
router.use('/api/v1', endpointsRoute)
router.use('/api/v1', rolesRoute)

module.exports = router
