const moment = require('moment');
const { jsonRespHandler } = require('../../../utilities/responseHandler');

const {
    Sequelize,
    sequelize,
    AccountClaim
} = require('../../../dataSource/models');

const {
    getItem,
    createItem,
    updateItem,
    deleteItem
} = require('../../../utilities/queryHandler');

const getAccountClaim = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id

            return await getItem(AccountClaim, id)
        })
}

const createAccountClaim = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            let accountClaimData = props.body

            return await createItem(AccountClaim, accountClaimData)
        })
}

const updateAccountClaim = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id
            let accountClaimdata = props.body
            let accountClaimItem = {...accountClaimdata, ...{ id }}

            return await updateItem(
                // model
                AccountClaim,
                // update data
                accountClaimItem,
                // setter function
                (accountClaimModel, accountClaimData) => {

                    if (accountClaimData.roleId)                 accountClaimModel['roleId'] = accountClaimData.password
                    if (accountClaimData.fullname)               accountClaimModel['fullname'] = accountClaimData.fullname
                    if (accountClaimData.disableAccountClaim)         accountClaimModel['disableAccountClaim'] = accountClaimData.disableAccountClaim

                    return accountClaimModel
                }
            )
        })
}

const deleteAccountClaim = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id

            return await deleteItem(AccountClaim, id)
        })
}

module.exports = {
    getAccountClaim,
    createAccountClaim,
    updateAccountClaim,
    deleteAccountClaim
}