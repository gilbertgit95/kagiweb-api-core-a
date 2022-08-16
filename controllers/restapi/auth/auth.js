const moment = require('moment');

const utils = require('../../../utilities');
const validationHandler = require('../../../utilities/validationHandler');
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

            // if the account is disabled
            // the return 403 not accessable
            if (user && user.disabledAccount) {
                let errMsg = 'Forbidden resources, the account you are trying to access is disabled.'
                await logger.setLogContent({ message: errMsg }).log()
                throw({
                    message: errMsg,
                    code: 403,
                })
            }

            // if user exist and the maximum login attempt exceeds
            // disable the user account
            if (   user
                && !user.disabledAccount
                && user.loginAccountAttempt >= maxLoginAttempts) {
                
                user.disabledAccount = true
                user.loginAccountAttempt = 0
                await user.save()
                
                let errMsg = 'Forbidden resources, you have reach the maximum login attempts. This account has been disabled, please contact the administrator.'
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

            // if the user did exists
            // generate authorization token
            // set login account key and
            // login account attempt to its zero values
            await logger.setLogContent({ message: 'Successful Login' }).log()
            accessToken = 'Bearer ' + encryptionHandler.generateJWT({ username })

            user.loginAccountAttempt = 0
            user.loginAccountKey = null

            user.resetPasswordAttempt = 0
            user.resetPasswordKey = null

            await user.save()

            return { accessToken }
        })
}

const logout = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            // get authorization from request header
            let tokenContent = req.headers.authorization? req.headers.authorization.replace('Bearer ', ''): ''
            let authContent = await encryptionHandler.verifyJWT(tokenContent)

            // if auth is empty throw error 400 no tokenContent supplied
            if (!Boolean(tokenContent)) {
                throw({
                    code: 400,
                    message: 'Bad request, no authorization supplied in the request.'
                })
            }

            // check for validity
            // if auth is invalid throw error 400 invalid tokenContent
            let invalidMsg = {
                code: 400,
                message: 'Bad request, Invalid authorization.'
            }
            if (!authContent) throw(invalidMsg)
            if (authContent && !authContent.username) throw(invalidMsg)

            // fetch user using username inside the token
            let user = await Account.findOne({username: authContent.username})
            // if user does not exist throw error 400 invalid tokenContent
            if (!user) throw(invalidMsg)

            // return successfull logout
            // log successfull logout user
            let message = 'Successful Logout'
            let logger = new Logger({
                account: user,
                title: 'Auth Logout Attempt',
                creator: tokenContent.username,
                message
            })
            await logger.log()

            return { message }
        })
}

const passwordResetCode = async (req, res) => {
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
            logger.setLogContent({ account: user })
            if (!user) {
                throw({
                    message: 'Not Found, user does not exist.',
                    code: 404,
                })
            }

            // return error 403 when the account is disabled
            if (user && user.disabledAccount) {
                let errMsg = 'Forbidden resources, the account you are trying to access is disabled.'
                await logger.setLogContent({ message: errMsg }).log()
                throw({
                    message: errMsg,
                    code: 403,
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
                
                let errMsg = 'Forbidden resources, you have reach the maximum password reset attempts. This account has been disabled, please contact the administrator.'
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
        .execute(async (props) => {

            // get username and resetCode from the request
            let { username = '', resetKey = '', newPassword='' } = props.body
            let logger = new Logger({title: 'Auth Password Reset'})

            // check required parameters
            if (!(Boolean(username) && Boolean(resetKey) && Boolean(newPassword))) {
                throw({
                    message: 'Bad request, username, resetKey and newPassword are required.',
                    code: 400,
                })
            }

            // check if the new password is valid
            // also check if the new password is the same as the old one
            let user = await Account.findOne({ where: { username }})
            logger.setLogContent({ account: user })
            if (!user) {
                throw({
                    message: 'Not Found, user does not exist.',
                    code: 404,
                })
            }

            // return error 403 when the account is disabled
            if (user && user.disabledAccount) {
                let errMsg = 'Forbidden resources, the account you are trying to access is disabled.'
                await logger.setLogContent({ message: errMsg }).log()
                throw({
                    message: errMsg,
                    code: 403,
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
                
                let errMsg = 'Forbidden resources, you have reach the maximum password reset attempts. This account has been disabled, please contact the administrator.'
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

            // check if the resetKey is coorect
            if (user.resetPasswordKey != resetKey) {
                let errMsg = 'Invalid Reset Key.'
                await logger.setLogContent({ message: errMsg + `. username: ${ username }, resetKey: ${ resetKey }, newPassword: ${ newPassword }` }).log()
                
                throw({
                    message: errMsg,
                    code: 400,
                })
            }

            // check the new password pattern
            let [isValidPassword, passErrors] = validationHandler.isValidPassword(newPassword)
            if (!isValidPassword) {
                let fErr = passErrors.length? passErrors[0]: 'Invalid Password.'
                await logger.setLogContent({ message: fErr + `. username: ${ username }, resetKey: ${ resetKey }, newPassword: ${ newPassword }` }).log()
                
                throw({
                    message: fErr,
                    code: 400,
                })
            }

            // check if the new password is the same as the old one
            let newAndOldPassMatched = await encryptionHandler.verifyTextToHash(newPassword, user.password)
            if (newAndOldPassMatched) {
                throw({
                    message: 'New Password should not be the same as the current one.',
                    code: 400,
                })
            }

            // hash the new password then set to user
            // reset passwordResetKey and attempts ot its zero values
            // then save to the user
            let newHashPass = await encryptionHandler.hashText(newPassword)
            user.password = newHashPass
            user.resetPasswordKey = null
            user.resetPasswordAttempt = 0
            await user.save()

            return { message: 'Successful Password reset.' }
            
        })
}

module.exports = {
    login,
    logout,
    passwordReset,
    passwordResetCode
}