function mysqlPool() {
const query = `
const mysql = require('mysql')

const pool = mysel.createPool({
connectionLimit: 10,
connectTimeout: 5000,
acquireTimeout: 5000,
queueLimit: 30,
host: "localhost",
user: "yourusername",
password: "yourpassword",
database: "mydb"
})

const getConnection = pool.getConnection((err, connection) => {
    if (err) return callback(err);
    callback(err, connection);
});

module.exports = getConnection;
`;
    return query;
}

module.exports = mysqlPool;

const mysql = require('mysql')

const pool = mysel.createPool({
connectionLimit: 10,
connectTimeout: 5000,
acquireTimeout: 5000,
queueLimit: 30,
host: "localhost",
user: "yourusername",
password: "yourpassword",
database: "mydb"
})

const getConnection = pool.getConnection((err, connection) => {
    if (err) console.log(err);
    callback(err, connection);
});

module.exports = getConnection;