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

const getMultipleAccountClaims = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            // fetching and pagination computation
            let pagginatedAccountClaims = await getItems(
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
            let accountIds = pagginatedAccountClaims.items.map(item => item.id)

            let accountsWithInfos = await getItems(async () => {
                return await Account.findAll({
                    where: { id: { [OPERATORS.in]: accountIds } },
                    include: ['role', 'accountClaims']
                })
            })

            pagginatedAccountClaims.items = accountsWithInfos

            return pagginatedAccountClaims
        })
}

const createMultipleAccountClaims = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let accountClaimsData = props.body
            
            return await bulkCreate(Account, accountClaimsData)
        })
}

const updateMultipleAccountClaims = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let accountsData = props.body

            return await bulkUpdate(
                // Account model
                Account,

                // Accounts to update
                accountsData,

                // setter function
                (accountModel, accountClaimData) => {

                    if (accountClaimData.roleId)                 accountModel['roleId'] = accountClaimData.password
                    if (accountClaimData.fullname)               accountModel['fullname'] = accountClaimData.fullname
                    if (accountClaimData.disableAccount)         accountModel['disableAccount'] = accountClaimData.disableAccount

                    return accountModel
                }
            )
        })
}

const deleteMultipleAccountClaims = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let accountClaimsData = props.body

            return await bulkDelete(Endpoint, accountClaimsData)
        })
}

module.exports = {
    getMultipleAccountClaims,
    createMultipleAccountClaims,
    updateMultipleAccountClaims,
    deleteMultipleAccountClaims
}