const router = require('express').Router();

const {
    getAllCountries
} = require('./countries');

/**
 * @swagger
 * tags:
 *      name: countries
 *      description: Api for countries information
 */

router.get('/staticOptions/allCountries', getAllCountries)

module.exports = router