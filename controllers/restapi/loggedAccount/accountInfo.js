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

const updateAccount = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id
            let accountdata = props.body
            let accountItem = {...accountdata, ...{ id }}

            return await updateItem(
                // model
                Account,
                // update data
                accountItem,
                // setter function
                (accountModel, accountData) => {

                    if (accountData.roleId)                 accountModel['roleId'] = accountData.password
                    if (accountData.fullname)               accountModel['fullname'] = accountData.fullname
                    if (accountData.disableAccount)         accountModel['disableAccount'] = accountData.disableAccount

                    return accountModel
                }
            )
        })
}

module.exports = {
    getAccount,
    updateAccount
}