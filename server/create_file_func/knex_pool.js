function mysqlPool() {
const query = `const knex = require('knex')({
  client: 'mysql',
  version: '5.7',
  connection: {
    host : '127.0.0.1',
    user : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test'
  },
  pool: { min: 2, max: 10 },
  acquireConnectionTimeout: 30000
});

module.exports = knex;
`;
    return query;
}

module.exports = mysqlPool;