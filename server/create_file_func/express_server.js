function buildExpressServer(database) {
  let query = `const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const ENV = process.env.ENV || dev;
`

  if( !database.includes('join') ) {
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
  query += `import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, './public')));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: ENV === 'dev'
});

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(\`🚀 Server ready at http://localhost:\${PORT}\${server.graphqlPath}\`)
)
`;
}
  return query;
}

module.exports = buildExpressServer;