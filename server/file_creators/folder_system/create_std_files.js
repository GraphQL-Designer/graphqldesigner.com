const fs = require('fs');
const path = require('path');

//Function Imports 
const createReadMe = require('../utl/create_readme');
const buildPackageJSON = require('../utl/create_packagejson');
const buildWebpack = require('../utl/create_webpack');
const buildClientRootIndex = require('../utl/create_client_root_index');
const buildComponentIndex = require('../utl/create_component_index');
const buildComponentStyle = require('../utl/create_component_style');
const buildExpressServer = require('../utl/express_server');
const buildIndexHTML = require('../utl/create_indexhtml');
const parseGraphqlServer = require('../utl/graphql_server');

module.exports = function(data, database, PATH, dateStamp, cb) {
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/readme.md`), createReadMe());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/package.json`), buildPackageJSON(database));
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/webpack.config.js`), buildWebpack());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/index.js`), buildClientRootIndex());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/components/index.js`), buildComponentIndex());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/components/index.css`), buildComponentStyle());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/index.js`), buildExpressServer(database));
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/public/index.html`), buildIndexHTML());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/public/styles.css`), '');

    if (!database.includes('Join')) {
      fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/graphql-schema/index.js`), 
      parseGraphqlServer(data, database));
    }

    return cb();
}