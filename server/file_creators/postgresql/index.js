const fs = require('fs');
const path = require('path');

//Function Imports
const sqlPool = require('../utl/sql_pool');
const parsePostgreTables = require('./postgresql_scripts');

module.exports = function(data, PATH, dateStamp) {
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db/postgresql_pool.js`), sqlPool('Postgres'));
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db/postgresql_scripts.sql`), parsePostgreTables(data));
}