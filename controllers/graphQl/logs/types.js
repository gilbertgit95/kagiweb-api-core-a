const graphql = require('graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = graphql;

const LogType = new GraphQLObjectType({
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

module.exports = {
    LogType
}