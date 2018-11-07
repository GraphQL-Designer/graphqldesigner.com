const fs = require('fs');
const path = require('path');

//Function Imports
const sqlPool = require('../utl/sql_pool');
const parseMySQLTables = require('./mysql_scripts');

module.exports = function(data, PATH, dateStamp) {
  fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db/mysql_pool.js`), sqlPool('MySQL'));
  fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db/mysql_scripts.sql`), parseMySQLTables(data));
}
    