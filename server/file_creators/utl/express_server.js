function buildExpressServer(database) {
  let query = `require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000;
const ENV = process.env.ENV || 'dev';
`

  if( !database.includes('Join') ) {
    query += `const graphqlHTTP = require('express-graphql');
const schema = require('./graphql-schema');
`;
  
    if (database === 'MongoDB') {
      query += `const mongoose = require('mongoose');
const MongoDB = process.env.MONGO_URI || 'mongodb://localhost/graphql';
  
mongoose.connect(MongoDB, { useNewUrlParser: true }, () => console.log('connected to database'));
`;
    }
  
    query += `
app.use(express.static(path.join(__dirname, './public')));
    
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: false //Set to true to view GraphiQl in browser at /graphql
}));

app.listen(PORT, () => {
  console.log(\`Listening on \${PORT}\`)
});
`;
} else {
  query += `const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const joinMonsterAdapt = require('join-monster-graphql-tools-adapter');
const joinMonsterMetadata = require('./resolvers/join-monster-metadata');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  playground: ENV === 'dev'
});

joinMonsterAdapt(schema, joinMonsterMetadata);

app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, './public')));

const server = new ApolloServer({ schema });

server.applyMiddleware({ app });

app.listen(PORT, () => console.log(\`Listing on \${PORT}!\`));
`;
}
  return query;
}

module.exports = buildExpressServer;

// const { graphiqlExpress, graphqlExpress } = require('graphql-server-express');
// const bodyParser = require('body-parser');

// app.use(
//   '/graphiql',
//   graphiqlExpress({
//     endpointURL: '/graphql',
//   }),
// );

// app.use(
//   '/graphql',
//   bodyParser.json(),
//   graphqlExpress({ schema, context: {} }),
// );