const moment = require('moment');
const { jsonRespHandler } = require('../../../utilities/responseHandler');

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
            let actionType = 'changePassword'

            // if current password is empty
            // return status 400, the current password does not exist in the request

            // check if the current password matched the user password
            // if not
            // return status 400, wrong password


            if (actionType === 'changePassword') {
            // get current password
            // get the new password

            // if current password or new password is empty
            // return status 400, the current or the new password does not exist in the request

            // if new password is not valid
            // return status 400, not valid password

            // hash the new password
            // then set the new hash to the current user password

            // return success message

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