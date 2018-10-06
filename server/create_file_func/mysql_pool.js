function mysqlPool() {
const query = `const mysql = require('mysql')

const pool = mysql.createPool({
connectionLimit: 10,
connectTimeout: 5000,
acquireTimeout: 5000,
queueLimit: 30,
host: "localhost",
user: "yourusername",
password: "yourpassword",
database: "mydb"
})

const getConnection = function(callback) {
    pool.getConnection(function(err, con) {
        if (err) return callback(err);
        callback(err, con);
    });
};

module.exports = getConnection;
`;
    return query;
}

module.exports = mysqlPool;