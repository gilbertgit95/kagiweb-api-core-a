const router = require('express').Router();

const {
    getRolesEndpoints,
    getRoleEndpoints,
    addRoleEndpoints,
    updateRoleEndpoints,
    deleteRoleEndpoints
} = require('./roleEndpoints');

router.get('/roleEndpoints', getRolesEndpoints)
router.get('/roleEndpoints/:uuid', getRoleEndpoints)
router.post('/roleEndpoints/:uuid', addRoleEndpoints)
router.put('/roleEndpoints/:uuid', updateRoleEndpoints)
router.put('/roleEndpoints/:uuid', deleteRoleEndpoints)

module.exports = router