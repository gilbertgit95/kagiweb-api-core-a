const moment = require('moment');
const {
    jsonRespHandler
} = require('../../utilities/responseHandler');

const {
    getItems,
    bulkCreate,
    bulkUpdate,
    bulkDelete
} = require('../../utilities/queryHandler');

const {
    Sequelize,
    sequelize,
    Account
} = require('./../../dataSource/models');

const getMultipleAccounts = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            // fetching and pagination computation
            return await getItems(
                {
                    // props contains the query params
                    props,
                    // overwite page size (optional)
                    // null will just use the default pagination
                    pageSize: null,
                    // base path for the next page
                    path: 'api/v1/accounts'
                },

                // callback for the actual query
                async ({limit, offset}) => {
                    return await Account.findAndCountAll({
                        limit,
                        offset,
                        include: 'role'
                    })
                }
            )

        })
}

const createMultipleAccounts = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let AccountsData = props.body
            
            return await bulkCreate(Account, AccountsData)
        })
}

const updateMultipleAccounts = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let accountsData = props.body

            return await bulkUpdate(
                // Account model
                Account,

                // Accounts to update
                accountsData,

                // setter function
                (accountModel, accountData) => {

                    // if (accountData.Account)    accountModel['Account'] = accountData.Account
                    // if (accountData.type)        accountModel['type'] = accountData.type
                    // if (accountData.category)    accountModel['category'] = accountData.category
                    // if (accountData.subcategory) accountModel['subcategory'] = accountData.subcategory
                    // if (accountData.description) accountModel['description'] = accountData.description

                    return accountModel
                }
            )
        })
}

const deleteMultipleAccounts = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let accountsData = props.body

            return await bulkDelete(Endpoint, accountsData)
        })
}

module.exports = {
    getMultipleAccounts,
    createMultipleAccounts,
    updateMultipleAccounts,
    deleteMultipleAccounts
}