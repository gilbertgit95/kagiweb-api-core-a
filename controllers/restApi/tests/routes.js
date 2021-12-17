const router = require('express').Router();

const {
    getTests
} = require('./tests');

router.get('/tests/:vals', getTests)

module.exports = router