const moment = require('moment');
const { jsonRespHandler } = require('../../utilities/responseHandler');

const {
    Sequelize,
    sequelize,
    Endpoint
} = require('./../../dataSource/models');

const {
    getItem,
    createItem,
    updateItem,
    deleteItem
} = require('../../utilities/queryHandler');

const getSingleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid

            return await getItem(Endpoint, uuid)
        })
}

const createSingleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {

            let endpointData = props.body

            return await createItem(Endpoint, endpointData)
        })
}

const updateSingleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid
            let endpointData = props.body
            let endpointItem = {...endpointData, ...{ uuid }}

            return await updateItem(
                Endpoint,
                endpointItem,
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

const deleteSingleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid

            return await deleteItem(Endpoint, uuid)
        })
}

module.exports = {
    getSingleEndpoint,
    createSingleEndpoint,
    updateSingleEndpoint,
    deleteSingleEndpoint
}