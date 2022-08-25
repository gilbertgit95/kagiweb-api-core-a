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

            // parameters
            // for password change:
            // let currentPassword =
            // let newPasword =

            // for emails change:
            // let primaryEmail = 
            // let secondaryEmail = 

            // for phone numbers change:
            // let primaryPhone = 
            // let secondaryPhone =

            // base on the action type
            // execute the right process
            // process for changing the password
            if (actionType === 'changePassword') {
            // get current password
            // get the new password

            // process for changing emails
            } else if (actionType === 'changeEmails') {
            // get the emails


            // process for changing phone numbers
            } else if (actionType === 'changePhones') {
            // get the phones
            

            // return status 400 if invalid action type
            } else {
                throw({
                    code: 400,
                    message: 'Bad request, none or invalid action type.'
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