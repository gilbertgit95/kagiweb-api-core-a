const moment = require('moment');
const { jsonRespHandler } = require('../../../utilities/responseHandler');

const {
    Sequelize,
    sequelize,
    Account
} = require('../../../dataSource/models');

const {
    getItem,
    createItem,
    updateItem,
    deleteItem
} = require('../../../utilities/queryHandler');

const getAccount = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id

            return await getItem(Account, id)
        })
}

const createAccount = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            let accountData = props.body

            return await createItem(Account, accountData)
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

const deleteAccount = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id

            return await deleteItem(Account, id)
        })
}

module.exports = {
    getAccount,
    createAccount,
    updateAccount,
    deleteAccount
}