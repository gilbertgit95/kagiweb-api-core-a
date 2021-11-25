const router = require('express').Router();

const {
    getMultipleRoleEndpoints
} = require('./multipleRoleEndpoints');

// const {
//     getSingleRoleEndpoint,
//     createSingleRoleEndpoint,
//     updateSingleRoleEndpoint,
//     deleteSingleRoleEndpoint
// } = require('./singleRoleEndpoint');

router.get('/roleEndpoints', getMultipleRoleEndpoints)

module.exports = router