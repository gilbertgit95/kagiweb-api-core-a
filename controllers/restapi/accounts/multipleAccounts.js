const moment = require('moment');
const {
    jsonRespHandler
} = require('../../../utilities/responseHandler');

const {
    getItems,
    bulkCreate,
    bulkUpdate,
    bulkDelete
} = require('../../../utilities/queryHandler');

const {
    Sequelize,
    sequelize,
    Account
} = require('../../../dataSource/models');

const OPERATORS = Sequelize.Op;

const getMultipleAccounts = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            // fetching and pagination computation
            let pagginatedAccounts = await getItems(
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
                        attributes: ['id']
                    })
                }
            )
            let accountIds = pagginatedAccounts.items.map(item => item.id)

            let accountsWithInfos = await getItems(async () => {
                return await Account.findAll({
                    where: { id: { [OPERATORS.in]: accountIds } },
                    include: ['role', 'accountClaims']
                })
            })

            pagginatedAccounts.items = accountsWithInfos

            return pagginatedAccounts
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

                    if (accountData.roleId)                 accountModel['roleId'] = accountData.password
                    if (accountData.fullname)               accountModel['fullname'] = accountData.fullname
                    if (accountData.disableAccount)         accountModel['disableAccount'] = accountData.disableAccount

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