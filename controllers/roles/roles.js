const moment = require('moment');
const { jsonRespHandler } = require('./../../utilities/responseHandler');

const {
    Sequelize,
    sequelize
} = require('./../../dataSource/models');

const getRoles = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(props => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            console.log('getRoles: ', req.account)
            return {}
        })
}

const createRoles = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(props => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            return {}
        })
}

const updateRoles = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(props => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            return {}
        })
}

const deleteRoles = async (req, res) => {
    return await jsonRespHandler(req, res)
        .execute(props => {
            // throw({code: 500, message: 'na daot'})
            // throw({code: 404, message: 'na daot'})
            return {}
        })
}

module.exports = {
    getRoles,
    createRoles,
    updateRoles,
    deleteRoles
}