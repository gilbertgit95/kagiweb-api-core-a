const moment = require('moment');
const { jsonRespHandler } = require('../../utilities/responseHandler');

const {
    Sequelize,
    sequelize,
    Endpoint
} = require('./../../dataSource/models');

const getSingleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid

            let endPoint = {}

            try {
                endPoint = await Endpoint.findOne({ where: { uuid }})

                if (!endPoint) throw({code: 500, message: 'Not existing endpoint.'})

            } catch (err) {
                if (err.errors) {
                    throw({code: 500, message: err.errors[0].message})
                } else {
                    throw(err)
                }
            }

            return endPoint
        })
}

const createSingleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let {
                endpoint,
                type,
                category,
                subcategory,
                description
            } = props.body

            let createdData = {}

            try {
                createdData = await Endpoint.create({
                    endpoint,
                    type,
                    category,
                    subcategory,
                    description
                })
            } catch (err) {
                if (err.errors) {
                    throw({code: 500, message: err.errors[0].message})
                } else {
                    throw(err)
                }
            }

            return createdData
        })
}

const updateSingleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid
            let {
                endpoint,
                type,
                category,
                subcategory,
                description
            } = props.body

            let tobeUpdated = {}

            try {
                tobeUpdated = await Endpoint.findOne({ where: { uuid }})

                if (!tobeUpdated) throw({code: 500, message: 'Not existing endpoint.'})

                if (endpoint)    tobeUpdated['endpoint'] = endpoint
                if (type)        tobeUpdated['type'] = type
                if (category)    tobeUpdated['category'] = category
                if (subcategory) tobeUpdated['subcategory'] = subcategory
                if (description) tobeUpdated['description'] = description

                await tobeUpdated.save()

            } catch (err) {
                if (err.errors) {
                    throw({code: 500, message: err.errors[0].message})
                } else {
                    throw(err)
                }
            }

            return tobeUpdated
        })
}

const deleteSingleEndpoint = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let uuid = props.params.uuid

            let tobeDeleted = {}

            try {
                tobeDeleted = await Endpoint.findOne({ where: { uuid }})

                if (!tobeDeleted) throw({code: 500, message: 'Not existing endpoint.'})

                await tobeDeleted.destroy()

            } catch (err) {
                if (err.errors) {
                    throw({code: 500, message: err.errors[0].message})
                } else {
                    throw(err)
                }
            }

            return tobeDeleted
        })
}

module.exports = {
    getSingleEndpoint,
    createSingleEndpoint,
    updateSingleEndpoint,
    deleteSingleEndpoint
}