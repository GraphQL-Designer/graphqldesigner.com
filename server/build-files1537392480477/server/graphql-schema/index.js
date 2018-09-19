const graphql = require('graphql');
const  = require('../db-model/.js');

const { 
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLID,
    GraphQLString, 
    GraphQLInt, 
    GraphQLList,
    GraphQLNonNull
} = graphql;

const Type = new GraphQLObjectType({
	name: '',
	fields: () => ({

	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		s: {
			type: new GraphQLList(Type),
			resolve() {
				return .find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		add: {
			type: Type,
			args: {

			},
			resolve(parent, args) {
				const  = new (args);
				return .save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});