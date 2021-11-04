const moment = require('moment');
const { jsonRespHandler } = require('../../utilities/responseHandler');
const { btoa, atob } = require('../../utilities/encryptionHandler');

const {
    Sequelize,
    sequelize
} = require('./../../dataSource/models');

const getTests = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(props => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            console.log(btoa('test'))
            console.log(atob('dGVzdA=='))
            // console.log('getTests: ', req.account)
            return {}
        })
}

module.exports = {
    getTests
}