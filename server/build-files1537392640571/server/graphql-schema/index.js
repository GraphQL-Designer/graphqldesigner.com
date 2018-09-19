const graphql = require('graphql');
const Ef = require('../db-model/ef.js');

const { 
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLID,
    GraphQLString, 
    GraphQLInt, 
    GraphQLList,
    GraphQLNonNull
} = graphql;

const EfType = new GraphQLObjectType({
	name: 'Ef',
	fields: () => ({

	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		efs: {
			type: new GraphQLList(EfType),
			resolve() {
				return Ef.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addEf: {
			type: EfType,
			args: {

			},
			resolve(parent, args) {
				const ef = new Ef(args);
				return ef.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});