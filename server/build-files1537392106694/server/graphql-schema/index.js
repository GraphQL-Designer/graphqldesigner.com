const graphql = require('graphql');
const Auhtor = require('../db-model/auhtor.js');
const Book = require('../db-model/book.js');

const { 
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLID,
    GraphQLString, 
    GraphQLInt, 
    GraphQLList,
    GraphQLNonNull
} = graphql;

const AuhtorType = new GraphQLObjectType({
	name: 'Auhtor',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLString }
	})
});

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		genre: { type: GraphQLString },
		authorId: { type: GraphQLString }
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		auhtors: {
			type: new GraphQLList(AuhtorType),
			resolve() {
				return Auhtor.find({});
			}
		},
		auhtor: {
			type: AuhtorType,
			args: { id: { type: GraphQLID }},
			resolve(parent, args) {
				return Auhtor.findById(args.id);
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve() {
				return Book.find({});
			}
		},
		book: {
			type: BookType,
			args: { id: { type: GraphQLID }},
			resolve(parent, args) {
				return Book.findById(args.id);
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuhtor: {
			type: AuhtorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parent, args) {
				const auhtor = new Auhtor(args);
				return auhtor.save();
			}
		},
		addBook: {
			type: BookType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parent, args) {
				const book = new Book(args);
				return book.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});