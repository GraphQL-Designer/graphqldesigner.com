const fs = require('fs');
const path = require('path');

//Function Imports
const createJoinSchema = require('./create_join_schema');
const createJoinResolvers = require('./create_join_resolvers');
const createJoinMetadata = require('./create_join_metadata');
//const createSequelizeConnection = require('../sequelize');
//const createSequelizeModels = require('../sequelize/create_sequelize_models');

module.exports = function(database, data, PATH, dateStamp) {
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/schema/index.js`), createJoinSchema(data));
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/resolvers/index.js`), createJoinResolvers(database, data));
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/resolvers/join-monster-metadata.js`), createJoinMetadata(data));
    
    // fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/models/index.js`), createSequelizeConnection(database, data));

    // for ( const index in data ) {
    //     fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/models/${data[index].type.toLowerCase()}.js`), createSequelizeModels(data[index]));
    // }
}