const moment = require('moment');

const {
    jsonRespHandler
} = require('../../../utilities/responseHandler');

const {
    getItems
} = require('../../../utilities/queryHandler');

const {
    Sequelize,
    sequelize,
    Log
} = require('../../../dataSource/models');

const fetchLogs =  async (req, res) => {
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
                    path: 'api/v1/logs'
                },

                // callback for the actual query
                async ({limit, offset}) => {
                    return await Log.findAndCountAll({
                        limit,
                        offset
                    })
                }
            )

        })
}

module.exports = {
    fetchLogs
}