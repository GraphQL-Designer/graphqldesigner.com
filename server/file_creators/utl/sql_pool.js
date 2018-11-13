function sqlPool(database) {
  let query = 'require(\'dotenv\').config();\n';

  // if MySQL, create MySQL specific code
  if (database === 'MySQL') {
    query += `const mysql = require('mysql')

const pool = mysql.createPool({
  connectionLimit: 10,
  connectTimeout: 5000,
  acquireTimeout: 5000,
  queueLimit: 30,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

const getConnection = function(callback) {
  pool.getConnection(function(err, con) {
    if (err) return callback(err);
    callback(err, con);
  });
};

module.exports = getConnection;`
  }

  // if Postgres, creat Postgres specific code
  if (database === 'Postgres') {
    query += `const { Pool } = require('pg')

const pool = new Pool({
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME

  //Or you can use a connectiong string
  //connectionString: 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb' 
})

const getConnection = function(callback) {
  pool.connect(function(err, con, release) {
    if (err) return callback(err);
    callback(err, con, release);
  });
};

module.exports = getConnection;
`;
}

  return query;
}

module.exports = sqlPool;
