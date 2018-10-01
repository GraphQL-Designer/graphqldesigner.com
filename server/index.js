const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const zipper = require('zip-local');
const path = require('path');
const PORT = process.env.PORT || 4100;
let PATH;

if (process.env.MODE === 'prod') {
  PATH = '/tmp/'
} else {
  PATH = path.join(__dirname, '../../');
};

const app = express();

const createReadMe = require('./create_file_func/create_readme');
const buildExpressServer = require('./create_file_func/express_server');
const parseClientQueries = require('./create_file_func/client_queries');
const parseClientMutations = require('./create_file_func/client_mutations');
const parseGraphqlMongoServer = require('./create_file_func/graphql_mongo_server');
const parseMongoschema = require('./create_file_func/mongo_schema');

app.use(bodyParser.json());;
app.use(express.static(path.join(__dirname, '../public')));

app.post('/write-files', (req, res) => {
  const data = req.body; // data.data is state.tables from schemaReducer. See Navbar component
  const dateStamp = Date.now();

  buildDirectories(dateStamp, () => {
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/readme.md`), createReadMe());
    fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/index.js`), buildExpressServer());

    buildClientQueries(data.data, dateStamp, () => {
      if (data.database === 'MongoDB') {
        buildForMongo(data.data, dateStamp, () => {
          // ZIP main build folder and responds to client
          zipper.sync.zip(path.join(PATH, `build-files${dateStamp}`)).compress().save(path.join(PATH, `graphql${dateStamp}.zip`));

          const file = path.join(PATH, `graphql${dateStamp}.zip`);
          res.setHeader('Content-Type', 'application/force-download');
          res.setHeader('Content-disposition', 'filename=graphql.zip');
          res.download(file, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Download Complete!');

              setTimeout(() => {
                deleteTempFiles(data.database, data.data, dateStamp, () => {
                  deleteTempFolders(dateStamp, () => {
                    console.log('Deleted Temp Files');
                  });
                });
              }, 6000);
            }
          });
        });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log('Server Listening!');
});

function buildDirectories(dateStamp, cb) {
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql', 'queries'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql', 'mutations'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'db-model'));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'graphql-schema'));
  return cb();
};

function buildClientQueries(data, dateStamp, cb) {
  fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/graphql/queries/index.js`), parseClientQueries(data));
  fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/client/graphql/mutations/index.js`), parseClientMutations(data));
  return cb();
};

function buildForMongo(data, dateStamp, cb) {
  fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/graphql-schema/index.js`), parseGraphqlMongoServer(data));
  const indexes = Object.keys(data);
  
  indexes.forEach(index => {
    parseMongoschema(data[index], query => {
      fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db-model/${data[index].type.toLowerCase()}.js`), query);
      });
    });
  return cb();
};

function deleteTempFiles(database, data, dateStamp, cb) {
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/readme.md`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/index.js`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/graphql/queries/index.js`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/graphql-schema/index.js`));

  if (database = 'MongoDB') {
    const indexes = Object.keys(data);

    function step(i) {
      if (i < indexes.length) {
        fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/db-model/${data[indexes[i]].type.toLowerCase()}.js`));
        step(i + 1);

      } else {

        fs.unlinkSync(path.join(PATH, `graphql${dateStamp}.zip`));
        return cb();
      }
    }
    step(0);
  };
};

function deleteTempFolders(dateStamp, cb) {
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'graphql-schema'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'db-model'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql', 'queries'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql', 'mutations'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'client'));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`));
  return cb();
};
