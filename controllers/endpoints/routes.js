const router = require('express').Router();

const {
    getMultipleEndpoints,
    createMultipleEndpoints,
    updateMultipleEndpoints,
    deleteMultipleEndpoints
} = require('./multipleEndpoints');

const {
    getSingleEndpoint,
    createSingleEndpoint,
    updateSingleEndpoint,
    deleteSingleEndpoint
} = require('./singleEndpoint');

// routes for handling batch data
router.get('/endpoints', getMultipleEndpoints)
router.post('/endpoints', createMultipleEndpoints)
router.put('/endpoints', updateMultipleEndpoints)
router.delete('/endpoints', deleteMultipleEndpoints)

// routes for handling single data
router.get('/endpoints/:uuid', getSingleEndpoint)
router.post('/endpoints/new', createSingleEndpoint)
router.put('/endpoints/:uuid', updateSingleEndpoint)
router.delete('/endpoints/:uuid', deleteSingleEndpoint)

module.exports = router