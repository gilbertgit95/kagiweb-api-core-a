const express = require('express');
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');

const log = require('./logs');

const router = express.Router();
const {
    GraphQLSchema,
    GraphQLObjectType
} = graphql;

const rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        ...log.queries
    }
})
const rootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        ...log.mutations
    }
})

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation
})

router.use('/api/v1/graphql', graphqlHTTP({
    schema,
    // only show graphiql ui if the environment is not in production
    graphiql: process.env.NODE_ENV && process.env.NODE_ENV != 'production'
}))

module.exports = router