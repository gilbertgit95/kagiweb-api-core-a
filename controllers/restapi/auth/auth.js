const moment = require('moment');

const utils = require('../../../utilities')
const encryptionHandler = require('../../../utilities/encryptionHandler');
const { jsonRespHandler } = require('../../../utilities/responseHandler');
const { getItem } = require('../../../utilities/queryHandler');
const { Logger } = require('../../../utilities/logHandler');

const {
    Account,
    Sequelize,
    sequelize
} = require('../../../dataSource/models');

const maxLoginAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || 10)
const maxPassResetAttempts = parseInt(process.env.MAX_PASSWORD_RESET_ATTEMPTS || 10)

const login = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            // get username and password from the request
            let { username, password } = props.body
            let accessToken = null
            let logger = new Logger({title: 'Auth Login Attempt'})


            // check the credential if it existed on the request
            if (!(password && username)) {
                let errMsg = 'Bad request, missing credential'
                await logger.setLogContent({ message: errMsg + `. username: ${ username }, password: ${ password }` }).log()
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

            // if user exist and the maximum login attempt exceeds
            // disable the user account
            if (   user
                && !user.disabledAccount
                && user.loginAccountAttempt >= maxLoginAttempts) {
                
                user.disabledAccount = true
                user.loginAccountAttempt = 0
                await user.save()
                
                let errMsg = 'Forbidden resources, you have reach the maximum login attempts. This account has been disable, please contact the administrator.'
                await logger.setLogContent({ message: errMsg + `. username: ${ username }, password: ${ password }` }).log()
                
                throw({
                    message: errMsg,
                    code: 403,
                })
            }

            // if the user exist
            // encrement login account attempt
            // then save user update
            if (user && !user.disabledAccount) {
                user.loginAccountAttempt++
                await user.save()
            }


            // if the user does not match return error 400 wrong cred.
            if (!(user && passMatched)) {
                let errMsg = 'Bad request, wrong username or password'
                await logger.setLogContent({ message: errMsg + `. username: ${ username }, password: ${ password }` }).log()
                throw({
                    message: errMsg,
                    code: 400,
                })
            }


            // if the account is disabled
            // the return 403 not accessable
            if (user && passMatched && user.disabledAccount) {
                let errMsg = 'Forbidden resources, the account you are trying to access is disabled.'
                await logger.setLogContent({ message: errMsg }).log()
                throw({
                    message: errMsg,
                    code: 403,
                })
            }

            // if the user did exists
            // generate authorization token
            // set login account key and
            // login account attempt to its zero values
            await logger.setLogContent({ message: 'Successful Login' }).log()
            accessToken = encryptionHandler.generateJWT({ username })
            user.loginAccountAttempt = 0
            await user.save()

            return { accessToken }
        })
}

const logout = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            // get authorization from request header
            let token = req.headers.authorization
            let tokenContent = null

            // if not present on the header
            // return error 400 no auth present
            if (token) {
                tokenContent = await encryptionHandler.verifyJWT(token)
            } else {
                throw({
                    message: 'No authorizition present in the request header',
                    code: 400,
                })
            }

            // check authorization validity
            // if author. is not valid
            // return 400 auth not valid
            if (!tokenContent) {
                throw({
                    message: 'Authorization is not valid',
                    code: 400,
                })
            }

            // return successfull logout
            // log successfull logout user
            let message = 'Successful Logout'
            let logger = new Logger({
                title: 'Auth Logout Attempt',
                creator: tokenContent.username,
                message
            })
            await logger.log()

            return { message }
        })
}

const passwordResetCodeRequest = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            // get username in the request
            let { username } = props.body
            let logger = new Logger({
                title: 'Auth password reset key request',
                creator: username
            })

            // if no username present
            // return error 400
            if (!Boolean(username)) {
                throw({
                    message: 'No (username)identification supplied.',
                    code: 400,
                })
            }

            // fetch user info
            // if it does not exist
            // return error 400
            let user = await Account.findOne({ where: { username }})
            if (!user) {
                throw({
                    message: 'Not Found, user does not exist.',
                    code: 404,
                })
            }

            // if reset attempt is greater than or equal to max reset attempt
            // disable the user
            if (   user
                && !user.disabledAccount
                && user.resetPasswordAttempt >= maxPassResetAttempts) {
                
                user.disabledAccount = true
                user.resetPasswordAttempt = 0
                user.resetPasswordKey = null
                await user.save()
                
                let errMsg = 'Forbidden resources, you have reach the maximum password reset attempts. This account has been disable, please contact the administrator.'
                await logger.setLogContent({ message: errMsg + `. username: ${ username }` }).log()
                
                throw({
                    message: errMsg,
                    code: 403,
                })
            }

            // increment reset attempt
            if (user && !user.disabledAccount) {
                user.resetPasswordAttempt++
                await user.save()
            }

            if (user && user.disabledAccount) {
                let errMsg = 'Forbidden resources, the account you are trying to access is disabled.'
                await logger.setLogContent({ message: errMsg }).log()
                throw({
                    message: errMsg,
                    code: 403,
                })
            }

            // save generated key to
            // the user
            // generate key
            let respMsg = 'Success reset key request. Please check you email or contact your administrator.'
            let resetKey = encryptionHandler.generateRandNumberkey()
            user.resetPasswordKey = resetKey
            await user.save()

            // log info
            // send notification to user email or
            // notify the administrator
            await logger.setLogContent({ message: respMsg + ` username: ${ username }, key: ${ resetKey }` }).log()
            // :todo
            // mailer.send()
            // admin.notify()

            // return success message
            return { message: respMsg }
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
    passwordReset,
    passwordResetCodeRequest
}