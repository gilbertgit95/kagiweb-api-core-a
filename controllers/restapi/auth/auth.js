const moment = require('moment');

const encryptionHandler = require('../../../utilities/encryptionHandler');
const { jsonRespHandler } = require('../../../utilities/responseHandler');
const { getItem } = require('../../../utilities/queryHandler');
const { Logger } = require('../../../utilities/logHandler');

const {
    Account,
    Sequelize,
    sequelize
} = require('../../../dataSource/models');

const login = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            // get username and password from the request
            let { username, password } = props.body
            let accessToken = null
            let logger = new Logger({title: 'Auth Login Attempt'})


            // check the credential existed on the request
            if (!(password && username)) {
                let errMsg = 'Bad request, missing credential'
                await logger.setLogContent({ message: errMsg }).log()
                throw({
                    message: errMsg,
                    code: 400,
                })
            }

            // check if the user really exist and
            // also if the user is using the password
            let passMatched = false
            let user = await Account.findOne({ where: { username }})
            logger.setLogContent({ account: user })
            if (user && user.password) {
                passMatched = await encryptionHandler.verifyTextToHash(
                    password,
                    user.password
                )
            }

            // if the user did exists
            // generate authorization token
            // else if user does not exist
            // return 401 or Unauthorized status
            if (user && passMatched) {
                await logger.setLogContent({ message: 'Successful Login' }).log()
                accessToken = encryptionHandler.generateJWT({
                    username
                })
            } else {
                let errMsg = 'Bad request, wrong username or password'
                await logger.setLogContent({ message: errMsg + `. username: ${ username }, password: ${ password }` }).log()
                throw({
                    message: errMsg,
                    code: 400,
                })
            }

            return { accessToken }
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