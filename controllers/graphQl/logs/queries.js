const graphql = require('graphql');
const { LogType } = require('./types');
const { Log } = require('../../../dataSource/models');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = graphql;

const getAllLogs = {
    type: new GraphQLList(LogType),
    args: {},
    async resolve(parent, args) {
        return await Log.findAll({})
    }
}

module.exports = {
    getAllLogs
}