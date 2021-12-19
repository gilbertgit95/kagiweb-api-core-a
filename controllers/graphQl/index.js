const express = require('express');
const graphql = require('graphql');
const {
    graphqlHTTP
} = require('express-graphql');
const { Log } = require('../../dataSource/models');

const router = express.Router();
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = graphql

let LogType = new GraphQLObjectType({
    name: 'Log',
    fields: () => ({
        id:       { type: GraphQLString },
        message:  { type: GraphQLString },
        title:    { type: GraphQLString },
        creator:  { type: GraphQLString },
        createdAt:{ type: GraphQLString },
        updatedAt:{ type: GraphQLString }
    })
})

let rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getAllLogs: {
            type: new GraphQLList(LogType),
            args: {},
            async resolve(parent, args) {
                return await Log.findAll({})
            }
        }
    }
})
let rootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        createlog: {
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
    }
})

let schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation
})

router.use('/api/v1/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

module.exports = router