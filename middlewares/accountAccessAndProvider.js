const { jsonRespHandler } = require('./../utilities/responseHandler');
const { hasMatchEndpoints } = require('./../utilities/matchersHandler');

module.exports = async (req, res, next) => {
    return await jsonRespHandler(req, res, next)
        .execute(props => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            let accessEndpoints = [
                {
                    method: 'GET',
                    path: '/api/v1/tests/:vals'
                }
            ]
            let reqEndpoint = {
                method: req.method,
                path: req.path
            }

            let isMatch = hasMatchEndpoints(reqEndpoint, accessEndpoints)

            // let reg = pathToRegexp('/api/v1/tests/:vals')
            // let isMatch = reg.test(req.path)

            console.log('method: ', req.method)
            console.log('path: ', req.path)
            console.log('isMatch: ', isMatch)
            // console.log('check access then bind account info in the request object')
    
            req.account = {info: 'test account'}

            return
        })
}