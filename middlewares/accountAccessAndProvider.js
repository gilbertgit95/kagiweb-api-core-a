const { jsonRespHandler } = require('./../utilities/responseHandler');

module.exports = async (req, res, next) => {
    return await jsonRespHandler(req, res, next)
        .execute(props => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            console.log('check access then bind account info in the request object')
            req.account = {info: 'test account'}

            return
        })
}