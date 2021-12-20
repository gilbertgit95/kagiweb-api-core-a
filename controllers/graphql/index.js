const express = require('express');
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');

const log = require('./logs');

// initial constants
const ENV = process.env.NODE_ENV || 'development';
const ROOT_GRAPHQL = process.env.ROOT_GRAPHQL || '/api/v1/graphql';

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

router.use(ROOT_GRAPHQL, graphqlHTTP({
    schema,
    // only show graphiql ui if the environment is not in production mode
    graphiql: ENV != 'production'
}))

module.exports = router