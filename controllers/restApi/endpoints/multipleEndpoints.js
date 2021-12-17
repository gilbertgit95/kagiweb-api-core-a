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
    Endpoint
} = require('./../../../dataSource/models');

const getMultipleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            // fetching and pagination computation
            return await getItems(
                {
                    // props contains the query params
                    props,
                    // overwite page size (optional)
                    // null will just use the default pagination
                    pageSize: null,
                    // base path for the next page
                    path: 'api/v1/endpoints'
                },

                // callback for the actual query
                async ({limit, offset}) => {
                    return await Endpoint.findAndCountAll({
                        limit,
                        offset
                    })
                }
            )

        })
}

const createMultipleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let endpointsData = props.body
            
            return await bulkCreate(Endpoint, endpointsData)
        })
}

const updateMultipleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let endpointsData = props.body

            return await bulkUpdate(
                // endpont model
                Endpoint,

                // endpoints to update
                endpointsData,

                // setter function
                (endpointModel, endpointData) => {

                    if (endpointData.endpoint)    endpointModel['endpoint'] = endpointData.endpoint
                    if (endpointData.type)        endpointModel['type'] = endpointData.type
                    if (endpointData.category)    endpointModel['category'] = endpointData.category
                    if (endpointData.subcategory) endpointModel['subcategory'] = endpointData.subcategory
                    if (endpointData.description) endpointModel['description'] = endpointData.description

                    return endpointModel
                }
            )
        })
}

const deleteMultipleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let endpointsData = props.body

            return await bulkDelete(Endpoint, endpointsData)
        })
}

module.exports = {
    getMultipleEndpoints,
    createMultipleEndpoints,
    updateMultipleEndpoints,
    deleteMultipleEndpoints
}