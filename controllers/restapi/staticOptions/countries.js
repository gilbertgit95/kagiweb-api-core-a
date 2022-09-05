const moment = require('moment');
const { jsonRespHandler } = require('../../../utilities/responseHandler');

const countries = require('country-data-list').countries;
const currencies = require('country-data-list').currencies;
const regions = require('country-data-list').regions;
const languages = require('country-data-list').languages;
const callingCountries = require('country-data-list').callingCountries;


const getAllCountries = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            return countries.all
        })
}

module.exports = {
    getAllCountries
}