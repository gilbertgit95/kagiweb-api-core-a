const { getClientIp } = require('@supercharge/request-ip');
const geoip = require('geoip-country');

const { jsonRespHandler } = require('../utilities/responseHandler');

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

            return
        })
}