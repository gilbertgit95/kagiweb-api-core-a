const { getClientIp } = require('@supercharge/request-ip');
const geoip = require('geoip-country');
const { jsonRespHandler } = require('../utilities/responseHandler');

const countries = require('country-data-list').countries;
const currencies = require('country-data-list').currencies;
const regions = require('country-data-list').regions;
const languages = require('country-data-list').languages;
const callingCountries = require('country-data-list').callingCountries;

module.exports = async (req, res, next) => {
    return await jsonRespHandler(req, res, next)
        .execute(async (props) => {

            let ip = req.ip = getClientIp(req)
            let geoInfo = geoip.lookup(ip);

            let addressInfo = {
                ip: ip,
                country: geoInfo && geoInfo.country? geoInfo.country: null
            }

            req.address = addressInfo

            console.log('reqAddressProvider: ', addressInfo)
            console.log(
                countries.all
                // currencies
                // regions
                // languages
                // callingCountries
            )

            return
        })
}