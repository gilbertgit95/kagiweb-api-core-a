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

const getSingleRole = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id

            return await getItem(Role, id)
        })
}

const createSingleRole = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            let roleData = props.body

            return await createItem(Role, roleData)
        })
}

const updateSingleRole = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id
            let roledata = props.body
            let roleItem = {...roledata, ...{ id }}

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

const deleteSingleRole = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id

            return await deleteItem(Role, id)
        })
}

module.exports = {
    getSingleRole,
    createSingleRole,
    updateSingleRole,
    deleteSingleRole
}