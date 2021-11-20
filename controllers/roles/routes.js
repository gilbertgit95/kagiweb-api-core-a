const router = require('express').Router();

const {
    getMultipleRoles
} = require('./multipleRoles');

const {
    getSingleRole,
    createSingleRole,
    updateSingleRole,
    deleteSingleRole
} = require('./singleRole');

router.get('/roles', getMultipleRoles)

router.get('/roles/:uuid', getSingleRole)
router.post('/roles/new', createSingleRole)
router.put('/roles/:uuid', updateSingleRole)
router.delete('/roles/:uuid', deleteSingleRole)

module.exports = router