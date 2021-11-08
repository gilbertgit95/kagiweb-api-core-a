const moment = require('moment');
const { jsonRespHandler } = require('../../utilities/responseHandler');

const {
    Sequelize,
    sequelize,
    Endpoint
} = require('./../../dataSource/models');

const defaultPageSize = process.env.DEFAULT_PAGINATION
const defaultPageNumber = 1

const getMultipleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(props => {
            // parse query
            let pagesize = (parseInt(props.query.pagesize))? parseInt(props.query.pagesize): defaultPageSize
            let pagenumber = (parseInt(props.query.pageNumber))? parseInt(props.query.pageNumber): defaultPageNumber
            
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            return {
                next: null,
                items: [],
                pagesize,
                pagenumber,
                total: null
            }
        })
}

const createMultipleEndpoints = async (req, res) => {
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
                throw({code: 500, message: err.errors[0].message})
            }

            return createdData
        })
}

const updateMultipleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(async (props) => {
            let {
                uuid,
                endpoint,
                type,
                category,
                subcategory,
                description
            } = props.body

            let tobeUpdated = {}
            let updates = {}

            if (endpoint) updates['endpoint'] = endpoint
            if (type) updates['type'] = type
            if (category) updates['category'] = category
            if (subcategory) updates['subcategory'] = subcategory
            if (description) updates['description'] = description

            try {
                tobeUpdated = await Endpoint.findOne({ uuid })
                tobeUpdated = {
                    ...tobeUpdated,
                    ...updates
                }
                await tobeUpdated.save()
            } catch (err) {
                throw({code: 500, message: err.errors[0].message})
            }

            return tobeUpdated
        })
}

const deleteMultipleEndpoints = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(props => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            return {}
        })
}

module.exports = {
    getMultipleEndpoints,
    createMultipleEndpoints,
    updateMultipleEndpoints,
    deleteMultipleEndpoints
}