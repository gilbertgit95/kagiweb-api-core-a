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
            // action type
            // let actionType = 'password' // password || emails || phones

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