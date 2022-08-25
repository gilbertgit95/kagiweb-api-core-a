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
    AccountClaim
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
                    path: 'api/v1/accountClaims'
                },

                // callback for the actual query
                async ({limit, offset}) => {
                    return await AccountClaim.findAndCountAll({
                        limit,
                        offset,
                        attributes: ['id']
                    })
                }
            )
            let accountIds = pagginatedAccountClaims.items.map(item => item.id)

            let accountsWithInfos = await getItems(async () => {
                return await AccountClaim.findAll({
                    where: { accountId: { [OPERATORS.in]: accountIds } }
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
            
            return await bulkCreate(AccountClaim, accountClaimsData)
        })
}

const updateMultipleAccountClaims = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let accountClaimsData = props.body

            return await bulkUpdate(
                // Account model
                AccountClaim,

                // Accounts to update
                accountClaimsData,

                // setter function
                (accountClaimModel, accountClaimData) => {

                    if (accountClaimData.accountId) accountClaimModel['accountId'] = accountClaimData.accountId
                    if (accountClaimData.key)       accountClaimModel['key'] = accountClaimData.key
                    if (accountClaimData.type)      accountClaimModel['type'] = accountClaimData.type
                    if (accountClaimData.value)     accountClaimModel['value'] = accountClaimData.value

                    return accountClaimModel
                }
            )
        })
}

const deleteMultipleAccountClaims = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let accountClaimsData = props.body

            return await bulkDelete(AccountClaim, accountClaimsData)
        })
}

module.exports = {
    getMultipleAccountClaims,
    createMultipleAccountClaims,
    updateMultipleAccountClaims,
    deleteMultipleAccountClaims
}