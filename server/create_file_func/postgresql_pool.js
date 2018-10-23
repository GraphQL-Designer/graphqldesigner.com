function pgPool() {
  const query = `const { Pool } = require('pg')

  const pool = new Pool({
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    host: "localhost",
    user: "yourusername",
    password: "yourpassword",
    database: "mydb"
  })

  const connect = function(callback) {
    pool.connect(function(err, client) {
      if (err) return callback(err);
      callback(err, client);
    });
  };

  module.exports = connect;
`;
  return query;
}

module.exports = pgPool;
