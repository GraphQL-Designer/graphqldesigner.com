function buildExpressServer(database) {
let query = `const express = require('express');
const graphqlHTTP = require('express-graphql');
const GQLSchema = require('./graphql-schema');
const path = require('path');
const app = express();
`

if (database === 'MongoDB') {
  query += `
const mongoose = require('mongoose');

mongoose.connect('Your Database Here!');
`;
}

query += `
app.use(express.static(path.join(__dirname, './public')))

app.use('/graphql', graphqlHTTP({
  GQLSchema,
  graphiql: false //Set to true to view GraphiQl in browser at /graphql
}));

app.listen(4000, () => {
  console.log('Listening on 4000')
});
`;
  return query;
}

module.exports = buildExpressServer;