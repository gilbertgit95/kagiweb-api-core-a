const moment = require('moment');
const { jsonRespHandler } = require('../../../utilities/responseHandler');

const {
    Sequelize,
    sequelize
} = require('../../../dataSource/models');

const login = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(props => {
            // get username and password from the request
            console.log('props: ', props.body.username)

            // check if the user using the credential

            // if the user did exists
            // generate authorization token

            // if user does not exist
            // return 401 or Unauthorized status

            // or else if error uccured during the process
            // return 500 or Internal server error

            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            return {}
        })
}

const logout = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(props => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            return {}
        })
}

const passwordReset = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(props => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            return {}
        })
}

module.exports = {
    login,
    logout,
    passwordReset
}