const moment = require('moment');
const {
    jsonRespHandler
} = require('../../utilities/responseHandler');

const {
    getItem,
    getItems,
    createItem,
    updateItem,
    deleteItem
} = require('../../utilities/queryHandler');

const {
    Sequelize,
    sequelize,
    Role,
    Endpoint,
    RoleEndpoint
} = require('./../../dataSource/models');

const getRolesEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            return await getItems(async () => {
                return await Role.findAll({
                    include: ['endpoints']
                })
            })
        })
}

const getRoleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid

            return await getItem(async () => {
                return await Role.findOne({
                    where: { uuid },
                    include: ['endpoints']
                })
            })
        })
}

const addRoleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid

            return await getItem(async () => {
                return await Role.findOne({
                    where: { uuid },
                    include: ['endpoints']
                })
            })
        })
}

const updateRoleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid

            return await getItem(async () => {
                return await Role.findOne({
                    where: { uuid },
                    include: ['endpoints']
                })
            })
        })
}

const deleteRoleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid

            return await getItem(async () => {
                return await Role.findOne({
                    where: { uuid },
                    include: ['endpoints']
                })
            })
        })
} 

module.exports = {
    getRolesEndpoints,
    getRoleEndpoints,
    addRoleEndpoints,
    updateRoleEndpoints,
    deleteRoleEndpoints
}