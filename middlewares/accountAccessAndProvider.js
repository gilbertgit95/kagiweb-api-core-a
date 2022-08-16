const encryptionHandler = require('../utilities/encryptionHandler');
const { jsonRespHandler } = require('../utilities/responseHandler');
const { hasMatchEndpoints } = require('../utilities/matchersHandler');

const { Account } = require('../dataSource/models');

module.exports = async (req, res, next) => {
    return await jsonRespHandler(req, res, next)
        .execute(async (props) => {
            // ___ start reference code ___

            // let accessEndpoints = [
            //     {
            //         method: 'GET',
            //         path: '/api/v1/tests/:vals'
            //     }
            // ]
            // let reqEndpoint = {
            //     method: req.method,
            //     path: req.path
            // }

            // let isMatch = hasMatchEndpoints(reqEndpoint, accessEndpoints)

            // let reg = pathToRegexp('/api/v1/tests/:vals')
            // let isMatch = reg.test(req.path)

            // console.log('method: ', req.method)
            // console.log('path: ', req.path)
            // console.log('isMatch: ', isMatch)
            // console.log('check access then bind account info in the request object')
    
            // req.account = {info: 'test account'}

            // ___ end reference code ___

            // get authorization
            let authKey = req.headers.authorization? req.headers.authorization.replace('Bearer ', ''): ''
            let authContent = await encryptionHandler.verifyJWT(authKey)

            // if auth is empty throw error 400 no authkey supplied
            if (!Boolean(authKey)) {
                throw({
                    code: 400,
                    message: 'Bad request, no authorization supplied in the request.'
                })
            }

            // check for validity
            // if auth is invalid throw error 400 invalid authkey
            let invalidMsg = {
                code: 400,
                message: 'Bad request, Invalid authorization.'
            }
            if (!authContent) throw(invalidMsg)
            if (authContent && !authContent.username) throw(invalidMsg)

            // fetch user using username inside the token
            let user = await Account.findOne({username: authContent.username})
            // if user does not exist throw error 400 invalid authkey
            if (!user) throw(invalidMsg)

            // if user exist
            // add user data in the request object
            req.account = user

            return
        })
}