const moment = require('moment');

const { removeRedundancy } = require('../../utilities')

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

            // fetch all endpoints
            let allEndpoints = await getItems(async () => {
                return await Endpoint.findAll({})
            })
            let allEndpointsMap = allEndpoints.reduce((acc, item) => {
                acc[item.uuid] = item
                return acc
            }, {})

            // fetch role endpoints
            let roleEndpoints = await getItem(async () => {
                return await Role.findOne({
                    where: { uuid },
                    include: ['endpoints']
                })
            })
            let roleEndpointsMap = roleEndpoints.endpoints
                .reduce((acc, item) => {
                    acc[item.uuid] = item
                    return acc
                }, {})

            // filter and transform data that are valid tobe created
            roleEndpointsData = removeRedundancy(
                roleEndpointsData,
                'endpointUuid'
            )
            roleEndpointsData = roleEndpointsData
                // remove redundant endpoints
                // filter only those that are existing in the endpoints
                .filter(item => {
                    return item.endpointUuid && allEndpointsMap[item.endpointUuid]
                })
                // filter only those that are none existing in role endpoints
                .filter(item => {
                    return item.endpointUuid && !roleEndpointsMap[item.endpointUuid]
                })
                // transform data for bulk creation
                .map(item => {
                    return {
                        roleId:     roleEndpoints.id,
                        endpointId: allEndpointsMap[item.endpointUuid].id
                    }
                })


            // then bulk create
            // await bulkCreate(RoleEndpoint, roleEndpointsData)
            console.log('bulk create: ', roleEndpointsData)

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
            let roleEndpointsData = props.body

            // fetch existing role endpoints

            // remove redundant data

            // filter only those that exist in the role endpoints

            // filter only those endpoints that are not currently assigned to this role

            //  then bulk update
            await bulkUpdate(
                // roleEndpoints model
                RoleEndpoints,

                // roleEndpoints to update
                roleEndpointsData,

                // setter function
                (roleEndpointModel, roleEndpointData) => {

                    if (roleEndpointData.roleId) roleEndpointModel['roleId'] = roleEndpointData.roleId
                    if (roleEndpointData.endpointId) roleEndpointModel['endpointId'] = roleEndpointData.endpointId

                    return roleEndpointModel
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

            // fetch role endpoints

            // filter only that are existing in the role endpoint

            // bulk delete
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