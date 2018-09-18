function buildExpressServer(data) {
    let query =
`const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const GQLSchema = require('./graphql-schema');
const path = require('path');
const app = express();

mongoose.connect('Your Database Here!');

app.use(express.static(path.join(__dirname, './public')))

app.use('/graphql', graphqlHTTP({
    GQLSchema
}));

app.listen(4000, () => {
    console.log('Listening on 4000')
});
`
  
    return query
}
  
module.exports = buildExpressServer;