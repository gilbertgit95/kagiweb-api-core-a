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

const createlog = {
    type: LogType,
    args: {
        message: { type: GraphQLString },
        title:   { type: GraphQLString },
        creator: { type: GraphQLString }
    },
    async resolve(parent, args) {
        return args
    }
}

module.exports = {
    createlog
}