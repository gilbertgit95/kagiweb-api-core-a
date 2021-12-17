const moment = require('moment');
const { jsonRespHandler } = require('../../../utilities/responseHandler');
const { btoa, atob, hashText, verifyTextToHash, generateJWT, verifyJWT } = require('../../../utilities/encryptionHandler');
const utils = require('../../../utilities/');

const {
    Sequelize,
    sequelize
} = require('../../../dataSource/models');

const getTests = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            // console.log('getTests: ', req.account)

            // atob btoa
            // console.log(btoa('test'))
            // console.log(atob('dGVzdA=='))


            // password hash
            // let hash = await hashText('test')
            // console.log('hash: ', hash)
            // console.log('isValid: ', await verifyTextToHash('test', hash))
            // console.log('isValid: ', await verifyTextToHash('tests', hash))

            // jwt
            // let jwtData = generateJWT({data: 'valdata'})
            // console.log('jwt: ', jwtData)

            // await utils.wait(2)
            // let datajwt = await verifyJWT(jwtData)
            // console.log('jwt data: ', datajwt)

            // console.log('env: ', process.env.NODE_ENV)

            return {}
        })
}

module.exports = {
    getTests
}