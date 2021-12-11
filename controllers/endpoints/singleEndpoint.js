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
            let id = props.params.id

            return await getItem(Endpoint, id)
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
            let id = props.params.id
            let endpointdata = props.body
            let endpointItem = {...endpointdata, ...{ id }}

            return await updateItem(
                // model
                Endpoint,
                // update data
                endpointItem,
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

const deleteSingleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let id = props.params.id

            return await deleteItem(Endpoint, id)
        })
}

module.exports = {
    getSingleEndpoint,
    createSingleEndpoint,
    updateSingleEndpoint,
    deleteSingleEndpoint
}