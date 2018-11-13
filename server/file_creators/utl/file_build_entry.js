//Function Imports
const buildDirectories = require('../folder_system/create_directories');
const buildStdFiles = require('../folder_system/create_std_files');
const buildClientQueries = require('../client');
const buildForMongo = require('../mognodb');
const buildForMySQL = require('../mysql');
const buildForPostgreSQL = require('../postgresql');
const buildForJoinMonster = require('../join_monster_apollo');

module.exports = function(database, data, PATH, dateStamp, cb) {
    buildDirectories(database, PATH, dateStamp, () => {
        buildStdFiles(database, PATH, dateStamp, () => {
            buildClientQueries(data, PATH, dateStamp, () => {

            if (database === 'MongoDB') buildForMongo(data, PATH, dateStamp);
            if (database.includes('MySQL')) buildForMySQL(data, PATH, dateStamp);
            if (database.includes('PostgreSQL')) buildForPostgreSQL(data, PATH, dateStamp);
            if (database.includes('Join')) buildForJoinMonster(database, data, PATH, dateStamp);

            return cb();
            })
        })
    })
}