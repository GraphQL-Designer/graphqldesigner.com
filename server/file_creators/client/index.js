const fs = require('fs');
const path = require('path');

//Function Imports
const parseClientQueries = require('./client_queries');
const parseClientMutations = require('./client_mutations');

module.exports = function(data, PATH, dateStamp, cb) {
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/graphql/queries/index.js`), parseClientQueries(data));
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/graphql/mutations/index.js`), parseClientMutations(data));

    return cb();
}