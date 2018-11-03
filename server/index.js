const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const zipper = require('zip-local');
const path = require('path');
const app = express();

//Build Function Import 
const createReadMe = require('./create_file_func/create_readme');
const buildExpressServer = require('./create_file_func/express_server');
const parseClientQueries = require('./create_file_func/client_queries');
const parseClientMutations = require('./create_file_func/client_mutations');
const parseGraphqlServer = require('./create_file_func/graphql_server');
const parseMongoSchema = require('./create_file_func/mongo_schema');
const parseMySQLTables = require('./create_file_func/mysql_scripts');
const parsePostgreTables = require('./create_file_func/postgresql_scripts');
const buildPackageJSON = require('./create_file_func/create_packagejson');
const buildWebpack = require('./create_file_func/create_webpack');
const buildIndexHTML = require('./create_file_func/create_indexhtml');
const buildClientRootIndex = require('./create_file_func/create_client_root_index');
const buildComponentIndex = require('./create_file_func/create_component_index');
const buildComponentStyle = require('./create_file_func/create_component_style');
const createJoinResolvers = require('./create_file_func/create_join_resolvers');
const createJoinSchema = require('./create_file_func/create_join_schema');
const sqlPool = require('./create_file_func/sql_pool');
//const knexPool = require('./create_file_func/knex_pool');

const PORT = process.env.PORT || 4100;
let PATH;

if (process.env.MODE === 'prod') {
  PATH = '/tmp/';
} else {
  PATH = path.join(__dirname, '../../');
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/write-files', (req, res) => {
  const { data, database } = req.body; // data.data is state.tables from schemaReducer. See Navbar component
  const dateStamp = Date.now();

  buildDirectories(data.databdateStamp, () => {

    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/readme.md`), createReadMe());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/package.json`), buildPackageJSON(database));
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/webpack.config.js`), buildWebpack());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/index.js`), buildClientRootIndex());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/components/index.js`), buildComponentIndex());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/components/index.css`), buildComponentStyle());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/index.js`), buildExpressServer(database));
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/public/index.html`), buildIndexHTML());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/public/styles.css`), '');

    if (!database.includes('join')) {
      fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/graphql-schema/index.js`), 
      parseGraphqlServer(data, database));
    }

    buildClientQueries(database, dateStamp, () => {

      if (database === 'MongoDB') buildForMongo(data, dateStamp);
      if (database === 'MySQL') buildForMySQL(database, data, dateStamp);
      if (database === 'PostgreSQL') buildForPostgreSQL(database, data, dateStamp);

      sendResponse(dateStamp, res, () => {
        setTimeout(() => {
          deleteTempFiles(database, data, dateStamp, () => {
            deleteTempFolders(database, dateStamp, () => {
            });
          });
        }, 5000);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server Listening to ${PORT}!`);
});


function buildDirectories(database, dateStamp, cb) {
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql', 'queries'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql', 'mutations'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'components'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'db'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'public'));

  if (!database.includes('join')) {
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'graphql-schema'));
  } else {
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'schema'));
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'resolvers'));
  }
  return cb();
}

function buildClientQueries(data, dateStamp, cb) {
  fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/graphql/queries/index.js`), parseClientQueries(data));
  fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/graphql/mutations/index.js`), parseClientMutations(data));
  return cb();
}

function buildForMongo(data, dateStamp) {
  const indexes = Object.keys(data);
  
  indexes.forEach(index => {
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db/${data[index].type.toLowerCase()}.js`), parseMongoSchema(data[index]));
  });
}

function buildForMySQL(database, data, dateStamp) {
  if(!database.includes('join')) {
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db/mysql_pool.js`), sqlPool('MySQL'));
  } else {
    createJoinResolvers(data);
    createJoinSchema(data)
  }
  fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db/mysql_scripts.sql`), parseMySQLTables(data));
}

function buildForPostgreSQL(database, data, dateStamp) {
  if(!database.includes('join')) {
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db/postgresql_pool.js`), sqlPool('Postgres'));
  } else {
    parseGraphqlJoinFiles(data, database);
  }
  fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db/postgresql_scripts.sql`), parsePostgresTables(data));
}

function parseGraphqlJoinFiles(data, database) {

}

function deleteTempFiles(database, data, dateStamp, cb) {
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/readme.md`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/package.json`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/webpack.config.js`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/index.js`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/graphql/queries/index.js`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/graphql/mutations/index.js`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/components/index.js`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/components/index.css`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/index.js`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/public/index.html`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/public/styles.css`));
  fs.unlinkSync(path.join(PATH, `graphql${dateStamp}.zip`));

  if(!database.includes('join')) {
    fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/graphql-schema/index.js`));
  }

  if (database === 'PostgreSQL') {
    if(!database.includes('join')) {
      fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/db/postgresql_pool.js`));
    } else {

    }
    
    fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/db/postgresql_scripts.sql`));
  }

  if (database === 'MySQL') {
    if(!database.includes('join')) {
      fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/db/mysql_pool.js`));
    } else {

    }
    fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/db/mysql_scripts.sql`));
  }

  if (database === 'MongoDB') {
    const indexes = Object.keys(data);

    function step(i) {
      if (i < indexes.length) {
        fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/db/${data[indexes[i]].type.toLowerCase()}.js`));
        step(i + 1);
      } 
    }
    step(0);
  }
  return cb();
}

function deleteTempFolders(database, dateStamp, cb) {
  if (!database.includes('join')) {
    fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'graphql-schema'));
  } else {
    fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'schema'));
    fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'resolvers'));
  }

  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql', 'queries'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql', 'mutations'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'components'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'public'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'db'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'client'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`));
  return cb();
}

function sendResponse(dateStamp, res, cb) {
  zipper.sync.zip(path.join(PATH, `build-files${dateStamp}`)).compress().save(path.join(PATH, `graphql${dateStamp}.zip`));

  const file = path.join(PATH, `graphql${dateStamp}.zip`);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-disposition', 'attachment');
  res.download(file, (err) => {
    if (err) console.log(err);
    console.log('Download Complete!');
    return cb();
  });
}
