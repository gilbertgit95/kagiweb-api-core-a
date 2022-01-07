const moment = require('moment');

const { removeRedundancy } = require('../../../utilities')

const {
    jsonRespHandler
} = require('../../../utilities/responseHandler');

const {
    getItem,
    getItems,
    bulkCreate,
    bulkUpdate,
    bulkDelete
} = require('../../../utilities/queryHandler');

const {
    Role,
    Endpoint,
    RoleEndpoint,
    Sequelize
} = require('../../../dataSource/models');

const OPERATORS = Sequelize.Op;

const getRolesEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            // fetching and pagination computation
            let pagginatedRoleEndpoints = await getItems(
                {
                    // props contains the query params
                    props,
                    // overwite page size (optional)
                    // null will just use the default pagination
                    pageSize: null,
                    // base path for the next page
                    path: 'api/v1/roleEndpoints'
                },

                // callback for the actual query
                async ({limit, offset}) => {
                    return await Role.findAndCountAll({
                        limit,
                        offset,
                        attributes: ['id']
                    })
                }
            )
            let roleIds = pagginatedRoleEndpoints.items.map(item => item.id)

            let roleEndpointsWithInfos = await getItems(async () => {
                return await Role.findAll({
                    where: { id: { [OPERATORS.in]: roleIds } },
                    include: ['endpoints']
                })
            })

            pagginatedRoleEndpoints.items = roleEndpointsWithInfos

            return pagginatedRoleEndpoints
        })
}

const getRoleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id

            return await getItem(async () => {
                return await Role.findOne({
                    where: { id },
                    include: ['endpoints']
                })
            })
        })
}

const addRoleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id
            let roleEndpointsData = props.body

            // fetch all endpoints
            let allEndpoints = await getItems(async () => {
                return await Endpoint.findAll({})
            })
            let allEndpointsMap = allEndpoints.reduce((acc, item) => {
                acc[item.id] = item
                return acc
            }, {})

            // fetch role endpoints
            let roleEndpoints = await getItem(async () => {
                return await Role.findOne({
                    where: { id },
                    include: ['endpoints']
                })
            })
            let roleEndpointsMap = roleEndpoints.endpoints
                .reduce((acc, item) => {
                    acc[item.id] = item
                    return acc
                }, {})

            // filter and transform data that are valid tobe created
            roleEndpointsData = removeRedundancy(
                roleEndpointsData,
                'endpointId'
            )
            roleEndpointsData = roleEndpointsData
                // remove redundant endpoints
                // filter only those that are existing in the endpoints
                .filter(item => {
                    return item.endpointId && allEndpointsMap[item.endpointId]
                })
                // filter only those that are none existing in role endpoints
                .filter(item => {
                    return item.endpointId && !roleEndpointsMap[item.endpointId]
                })
                // transform data for bulk creation
                .map(item => {
                    return {
                        roleId:     roleEndpoints.id,
                        endpointId: allEndpointsMap[item.endpointId].id
                    }
                })


            // then bulk create
            await bulkCreate(RoleEndpoint, roleEndpointsData)
            // console.log('bulk create: ', roleEndpointsData)

            return await getItem(async () => {
                return await Role.findOne({
                    where: { id },
                    include: ['endpoints']
                })
            })
        })
}

const updateRoleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id
            let roleEndpointsData = props.body

            // fetch all endpoints
            let allEndpoints = await getItems(async () => {
                return await Endpoint.findAll({})
            })
            let allEndpointsMap = allEndpoints.reduce((acc, item) => {
                acc[item.id] = item
                return acc
            }, {})

            // fetch existing role endpoints
            let roleEndpoints = await getItem(async () => {
                return await Role.findOne({
                    where: { id },
                    include: ['endpoints']
                })
            })
            let roleEndpointsMap = roleEndpoints.endpoints
                .reduce((acc, item) => {
                    acc.roleEnds[item.RoleEndpoint.id] = item
                    acc.ends[item.id] = item
                    return acc
                }, { roleEnds: {}, ends: {} })

            // remove redundant data
            roleEndpointsData = removeRedundancy(
                roleEndpointsData, 'endpointId'
            )
            roleEndpointsData = removeRedundancy(
                roleEndpointsData, 'roleEndpointId'
            )

            roleEndpointsData = roleEndpointsData
                // filter only those that exist in the role endpoints
                .filter(item => {
                    return item.roleEndpointId && roleEndpointsMap.roleEnds[item.roleEndpointId]
                })
                // filter only those endpoints that are not currently assigned to this role
                .filter(item => {
                    return item.endpointId && !roleEndpointsMap.ends[item.endpointId]
                })
                // transform data in preperation to bulk saving
                .map(item => {
                    return {
                        id: item.roleEndpointId,
                        endpointId: allEndpointsMap[item.endpointId].id
                    }
                })

            // console.log('bulk update: ', roleEndpointsData)
            // then bulk update
            await bulkUpdate(
                // roleEndpoints model
                RoleEndpoint,

                // roleEndpoints to update
                roleEndpointsData,

                // setter function
                (roleEndpointModel, roleEndpointData) => {

                    if (roleEndpointData.endpointId) {
                        roleEndpointModel['endpointId'] = roleEndpointData.endpointId
                    }

                    return roleEndpointModel
                }
            )

            return await getItem(async () => {
                return await Role.findOne({
                    where: { id },
                    include: ['endpoints']
                })
            })
        })
}

const deleteRoleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id

            let roleEndpointsData = props.body

            // fetch role endpoints
            // fetch existing role endpoints
            let roleEndpoints = await getItem(async () => {
                return await Role.findOne({
                    where: { id },
                    include: ['endpoints']
                })
            })
            let roleEndpointsMap = roleEndpoints.endpoints
                .reduce((acc, item) => {
                    acc[item.RoleEndpoint.id] = item
                    return acc
                }, {})

            // filter only that are existing in the role endpoint
            roleEndpointsData = roleEndpointsData
                // filter only those that exist in the role endpoints
                .filter(item => {
                    return item.roleEndpointId && roleEndpointsMap[item.roleEndpointId]
                })

            // bulk delete
            await bulkDelete(Endpoint, roleEndpointsData)

            return await getItem(async () => {
                return await Role.findOne({
                    where: { id },
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