const moment = require('moment');
const {
    jsonRespHandler
} = require('../../utilities/responseHandler');

const {
    getItem,
    getItems,
    bulkCreate,
    bulkUpdate,
    bulkDelete
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
            let roleEndpointsData = props.body

            // fetch existing role endpoints

            //  filter only the none existing

            // then bulk create
            await bulkCreate(RoleEndpoint, roleEndpointsData)

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
            let roleEndpointssData = props.body

            // fetch existing role endpoints

            // filter only those that exist

            //  then bulk update
            await bulkUpdate(
                // roleEndpoints model
                RoleEndpoints,

                // roleEndpointss to update
                roleEndpointssData,

                // setter function
                (roleEndpointsModel, roleEndpointsData) => {

                    if (roleEndpointsData.roleId) roleEndpointsModel['roleId'] = roleEndpointsData.roleId
                    if (roleEndpointsData.endpointId) roleEndpointsModel['endpointId'] = roleEndpointsData.endpointId

                    return roleEndpointsModel
                }
            )

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

            let roleEndpointsData = props.body

            await bulkDelete(Endpoint, roleEndpointsData)

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