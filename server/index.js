const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const zip = require('express-zip');
const zipper = require('zip-local');
const path = require('path');

const app = express();

const createReadMe = require('./create_file_func/create_readme');
const buildExpressServer = require('./create_file_func/express_server');
const parseClientQueries = require('./create_file_func/client_queries');
const parseClientMutations = require('./create_file_func/client_mutations');
const parseGraphqlMongoServer = require('./create_file_func/graphql_mongo_server');
const parseMongoschema = require('./create_file_func/mongo_schema');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/write-files', (req, res) => {
  const data = req.body; // data is state.tables from schemaReducer
  const dateStamp = Date.now();

  buildDirectories(dateStamp, () => {
    fs.writeFile(path.join(__dirname, `../../build-files${dateStamp}/readme.md`), createReadMe(), (err) => {
      if (err) console.log(err);

      fs.writeFile(path.join(__dirname, `../../build-files${dateStamp}/index.js`), buildExpressServer(), (err) => {
        if (err) console.log(err);

        buildClientQueries(data.data, dateStamp, () => {
          if (data.database = 'MongoDB') {
            buildForMongo(data.data, dateStamp, () => {
              // ZIP main build folder and responds to client
              zipper.sync.zip(path.join(__dirname, `../../build-files${dateStamp}`)).compress().save(path.join(__dirname, `../../graphql${dateStamp}.zip`));

              const file = `../graphql${dateStamp}.zip`;
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
  });
});

app.listen(4100, () => {
  console.log('Listening on 4100');
});


function buildDirectories(dateStamp, cb) {
  fs.mkdir(path.join(__dirname, `../../build-files${dateStamp}`), (err) => {
    if (err) console.log(err);

    fs.mkdir(path.join(__dirname, `../../build-files${dateStamp}`, 'client'), (err) => {
      if (err) console.log(err);

      fs.mkdir(path.join(__dirname, `../../build-files${dateStamp}`, 'client', 'graphql'), (err) => {
        if (err) console.log(err);

        fs.mkdir(path.join(__dirname, `../../build-files${dateStamp}`, 'client', 'graphql', 'queries'), (err) => {
          if (err) console.log(err);

          fs.mkdir(path.join(__dirname, `../../build-files${dateStamp}`, 'client', 'graphql', 'mutations'), (err) => {
            if (err) console.log(err);

            fs.mkdir(path.join(__dirname, `../../build-files${dateStamp}`, 'server'), (err) => {
              if (err) console.log(err);

              fs.mkdir(path.join(__dirname, `../../build-files${dateStamp}`, 'server', 'db-Model'), (err) => {
                if (err) console.log(err);

                fs.mkdir(path.join(__dirname, `../../build-files${dateStamp}`, 'server', 'graphql-schema'), (err) => {
                  if (err) console.log(err);

                  return cb();
                });
              });
            });
          });
        });
      });
    });
  });
}

function buildClientQueries(data, dateStamp, cb) {
  fs.writeFile(path.join(__dirname, `../../build-files${dateStamp}/client/graphql/queries/index.js`), parseClientQueries(data), (err) => {
    if (err) console.log(err);

    fs.writeFile(path.join(__dirname, `../../build-files${dateStamp}/client/graphql/mutations/index.js`), parseClientMutations(data), (err) => {
      if (err) console.log(err);

      return cb();
    });
  });
}

function buildForMongo(data, dateStamp, cb) {
  fs.writeFile(path.join(__dirname, `../../build-files${dateStamp}/server/graphql-schema/index.js`), parseGraphqlMongoServer(data), (err) => {
    if (err) console.log(err);

    const indexes = Object.keys(data);

    function step(i) {
      if (i < Object.keys(data).length) {
        fs.writeFileSync(path.join(__dirname, `../../build-files${dateStamp}/server/db-model/${data[indexes[i]].type.toLowerCase()}.js`), parseMongoschema(data[indexes[i]]), (err) => {
          if (err) console.log(err);
        });
        step(i + 1);
      } else {
        return cb();
      }
    }
    step(0);
  });
}

function deleteTempFiles(database, data, dateStamp, cb) {
  fs.unlink(path.join(__dirname, `../../build-files${dateStamp}/readme.md`), (err) => {
    if (err) console.log(err);

    fs.unlink(path.join(__dirname, `../../build-files${dateStamp}/index.js`), (err) => {
      if (err) console.log(err);

      fs.unlink(path.join(__dirname, `../../build-files${dateStamp}/client/graphql/queries/index.js`), (err) => {
        if (err) console.log(err);

        fs.unlink(path.join(__dirname, `../../build-files${dateStamp}/client/graphql/mutations/index.js`), (err) => {
          if (err) console.log(err);

          fs.unlink(path.join(__dirname, `../../build-files${dateStamp}/server/graphql-schema/index.js`), (err) => {
            if (err) console.log(err);

            if (database = 'MongoDB') {
              const indexes = Object.keys(data);

              function step(i) {
                if (i < Object.keys(data).length) {
                  fs.unlink(path.join(__dirname, `../../build-files${dateStamp}/server/db-model/${data[indexes[i]].type.toLowerCase()}.js`), (err) => {
                    if (err) console.log(err);
                  });
                  step(i + 1);
                } else {
                  fs.unlink(path.join(__dirname, `../../graphql${dateStamp}.zip`), (err) => {
                    if (err) console.log(err);

                    return cb();
                  });
                }
              }
              step(0);
            }
          });
        });
      });
    });
  });
}

function deleteTempFolders(dateStamp, cb) {
  fs.rmdir(path.join(__dirname, `../../build-files${dateStamp}`, 'server', 'graphql-schema'), (err) => {
    if (err) console.log(err);

    fs.rmdir(path.join(__dirname, `../../build-files${dateStamp}`, 'server', 'db-Model'), (err) => {
      if (err) console.log(err);

      fs.rmdir(path.join(__dirname, `../../build-files${dateStamp}`, 'server'), (err) => {
        if (err) console.log(err);

        fs.rmdir(path.join(__dirname, `../../build-files${dateStamp}`, 'client', 'graphql', 'queries'), (err) => {
          if (err) console.log(err);

          fs.rmdir(path.join(__dirname, `../../build-files${dateStamp}`, 'client', 'graphql', 'mutations'), (err) => {
            if (err) console.log(err);

            fs.rmdir(path.join(__dirname, `../../build-files${dateStamp}`, 'client', 'graphql'), (err) => {
              if (err) console.log(err);

              fs.rmdir(path.join(__dirname, `../../build-files${dateStamp}`, 'client'), (err) => {
                if (err) console.log(err);

                fs.rmdir(path.join(__dirname, `../../build-files${dateStamp}`), (err) => {
                  if (err) console.log(err);

                  return cb();
                });
              });
            });
          });
        });
      });
    });
  });
}
