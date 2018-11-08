module.exports = function(database, tables) {
    let query = `const Sequelize = require('sequelize');

const connection = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect:`
    query += database === 'MySQl' ? " 'mysql'," : " 'postgres',";
    query += `\n\t\toperatorsAliases: false,

    pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
    },
});

// Or you can simply use a connection uri
//const connection = new Sequelize('postgres://user:pass@example.com:5432/dbname');

connection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const db = {`

    let firstLoop = true;
    for (const i in tables) {
        const table = tables[i];
        if (!firstLoop) query += ',';
        firstLoop = false;
        query += `\n\t${table.type}: connection.import('./${table.type}')`;
    }

    query += `\n};\n
Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
    });
    
db.connection = connection;

module.exports = db;`
    
    return query
}