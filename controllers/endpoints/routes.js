const router = require('express').Router();

const {
    getEndpoints,
    createEndpoints,
    updateEndpoints,
    deleteEndpoints
} = require('./endpoints');

router.get('/endpoints', getEndpoints)
router.post('/endpoints', createEndpoints)
router.put('/endpoints', updateEndpoints)
router.delete('/endpoints', deleteEndpoints)

module.exports = router