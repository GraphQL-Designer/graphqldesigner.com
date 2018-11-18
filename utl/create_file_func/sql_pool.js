function sqlPool(database) {
  let query = '';

  // if MySQL, create MySQL specific code
  if (database === 'MySQL') {
    query += `const mysql = require('mysql')

const pool = mysql.createPool({
  connectionLimit: 10,
  connectTimeout: 5000,
  acquireTimeout: 5000,
  queueLimit: 30,`
  }

  // if Postgres, creat Postgres specific code
  if (database === 'Postgres') {
    query += `const { Pool } = require('pg')

const pool = new Pool({
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,`
  }

  // create remaining pool code not dependant on database
  query += `
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
})

module.exports = pool;
`;
  return query;
}

module.exports = sqlPool;
