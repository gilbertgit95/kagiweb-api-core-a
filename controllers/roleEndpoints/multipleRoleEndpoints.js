const moment = require('moment');
const {
    jsonRespHandler
} = require('../../utilities/responseHandler');

const {
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

const getMultipleRoleEndpoints = async (req, res) => {
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
                    path: 'api/v1/roleEndpoints'
                },

                // callback for the actual query
                async ({limit, offset}) => {
                    return await Role.findAndCountAll({
                        limit,
                        offset,
                        include: [Endpoint]
                    })
                }
            )

        })
}

module.exports = {
    getMultipleRoleEndpoints
}