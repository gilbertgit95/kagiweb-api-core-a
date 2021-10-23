const router = require('express').Router();

const {
    getRoles,
    createRoles,
    updateRoles,
    deleteRoles
} = require('./roles');

router.get('/roles', getRoles)
router.post('/roles', createRoles)
router.put('/roles', updateRoles)
router.delete('/roles', deleteRoles)

module.exports = router