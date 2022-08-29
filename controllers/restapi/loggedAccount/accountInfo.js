const moment = require('moment');
const validationHandler = require('../../../utilities/validationHandler');
const encryptionHandler = require('../../../utilities/encryptionHandler');
const { jsonRespHandler } = require('../../../utilities/responseHandler');
const { Logger } = require('../../../utilities/logHandler');

const {
    Sequelize,
    sequelize,
    Account
} = require('../../../dataSource/models');

const {
    getItem,
    updateItem
} = require('../../../utilities/queryHandler');

const getAccount = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            return req.account
        })
}

const updateAccountCred = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            // get the required action type and parameters
            let {
                actionType,
                currentPassword,
                newPassword,
                primaryEmail,
                secondaryEmail,
                primaryPhone,
                secondaryPhone
            } = props.body
            let logger = new Logger({title: 'LoggedAccount', account: req.account})

            // if current password is empty
            // return status 400, the current password does not exist in the request
            if (!Boolean(currentPassword)) {
                throw({
                    code: 400,
                    message: 'Bad request, current password is required.'
                })
            }

            // check if the current password matched the user password
            // if not
            // return status 400, wrong password
            let currentPassMatch = await encryptionHandler.verifyTextToHash(currentPassword, req.account.password)
            if (!currentPassMatch) {
                throw({
                    code: 400,
                    message: 'Bad request, wrong password.'
                })
            }


            if (actionType === 'changePassword') {
                // get current password
                // get the new password

                // if new password is empty
                // return status 400, the new password does not exist in the request
                if (!Boolean(newPassword)) {
                    throw({
                        code: 400,
                        message: 'Bad request, new password is not in the request.'
                    })
                }

                // check if the new password is the same as the old one
                let newAndOldPassMatched = await encryptionHandler.verifyTextToHash(newPassword, req.account.password)
                if (newAndOldPassMatched) {
                    throw({
                        message: 'New Password should not be the same as the current.',
                        code: 400,
                    })
                }

                // if new password is not valid
                // return status 400, not valid password
                let [isValidPassword, passErrors] = validationHandler.isValidPassword(newPassword)
                if (!isValidPassword) {
                    let err = passErrors.length? passErrors[0]: 'Invalid Password.'

                    throw({
                        message: err,
                        code: 400,
                    })
                }

                // hash the new password
                // then set the new hash to the current user password
                let newHashPass = await encryptionHandler.hashText(newPassword)
                req.account.password = newHashPass
                await req.account.save()
                await logger.setLogContent({
                    title: 'LoggedAccount Password Change',
                    message: 'Sucessfull password change'
                }).log()

                // return success message
                return { message: 'Successfull change of password.' }

            // process for changing emails
            } else if (actionType === 'changeEmails') {
            // get the emails, primary and secondary
            
            // check if the primary email exist and is valid
            // if not return status 400, primary email is not valid
            // else set user primary email with the new primary email

            // check if the secondary email exist and is valid
            // if not return status 400, secondary email is not valid
            // else set user secondary email with the new secondary email

            // return success message

            // process for changing phone numbers
            } else if (actionType === 'changePhones') {
            // get the phones, primary and secondary
            
            // check if the primary phone number exist and is valid
            // if not return status 400, primary phone number is not valid
            // else set user primary phone number with the new primary phone number

            // check if the secondary phone number exist and is valid
            // if not return status 400, secondary phone number is not valid
            // else set user secondary phone number with the new secondary phone number

            // return success message

            // return status 400 if invalid action type
            } else {
                throw({
                    code: 400,
                    message: 'Bad request, invalid action type.'
                })
            }

            return req.account
        })
}

const updateAccountProfile = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            // set this fields
            // basic profile:
            // - profilePhoto
            // - gender
            // - nickname
            // - firstname
            // - middlename
            // - lastname

            // advance profile:
            // - nationality
            // - birthDate
            // - birthPlace
            // - homeAddress
            // - website
            // - bio

            // work related:
            // - jobTitle
            // - companyName
            // - companyDesc
            // - companyIndustryType
            // - companyEmail
            // - companyNumber
            // - companyWebsite
            // - companyAddress

            return req.account
        })
}

const updateAccountSettings = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            return req.account
        })
}



module.exports = {
    getAccount,
    updateAccountCred,
    updateAccountProfile,
    updateAccountSettings
}