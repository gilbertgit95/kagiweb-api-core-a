const moment = require('moment');
const { jsonRespHandler } = require('../../utilities/responseHandler');

const {
    Sequelize,
    sequelize,
    Role
} = require('../../dataSource/models');

const {
    getItem,
    createItem,
    updateItem,
    deleteItem
} = require('../../utilities/queryHandler');

const getSingleRoleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid

            return await getItem(Role, uuid)
        })
}

const createSingleRoleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            let roleData = props.body

            return await createItem(Role, roleData)
        })
}

const updateSingleRoleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid
            let roledata = props.body
            let roleItem = {...roledata, ...{ uuid }}

            return await updateItem(
                // model
                Role,
                // update data
                roleItem,
                // setter function
                (roleModel, roleData) => {

                    if (roleData.name) roleModel['name'] = roleData.name
                    if (roleData.description) roleModel['description'] = roleData.description

                    return roleModel
                }
            )
        })
}

const deleteSingleRoleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid

            return await deleteItem(Role, uuid)
        })
}

module.exports = {
    getSingleRoleEndpoint,
    createSingleRoleEndpoint,
    updateSingleRoleEndpoint,
    deleteSingleRoleEndpoint
}