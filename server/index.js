const express = require('express');
const bodyParser = require('body-parser')
const fs = require("fs");
const zip = require('express-zip');
var zipper = require("zip-local");
const path = require('path');
const app = express();

const createReadMe = require('./create_file_func/create_readme');
const buildExpressServer = require('./create_file_func/express_server')
const parseClientQueries = require('./create_file_func/client_queries');
const parseClientMutations = require('./create_file_func/client_mutations');
const parseGraphqlMongoServer = require('./create_file_func/graphql_mongo_server.js');
const parseMongoschema = require('./create_file_func/mongo_schema');

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public')))

app.post('/write-files', (req, res) => {
    const data = req.body;
    const dateStamp = Date.now();

    buildDirectories(dateStamp, () => {

        fs.writeFile(path.join(__dirname, `build-files${dateStamp}/readme.md`), createReadMe(), (err) => {
            if (err) console.log(err)
    
            fs.writeFile(path.join(__dirname, `build-files${dateStamp}/index.js`), buildExpressServer(), (err) => {
                if (err) console.log(err)
                
                buildClientQueries(data.data, dateStamp, () => {

                    if (data.database = 'MongoDB') {
                        buildForMongo(data.data, dateStamp, () => {
                            
                            // zipper.sync.zip(path.join(__dirname, `build-files${dateStamp}/index.js`)).compress().save(path.join(__dirname, "graphql.zip"));
                            
                            zipper.sync.zip(path.join(__dirname, `build-files${dateStamp}`)).compress().save(path.join(__dirname, "graphql.zip"));

                            //res.set('Content-Type', 'text/plain')
                            //res.set('Content-Type', 'application/octet-stream')
                            console.log('dirname', __dirname)
                            res.download(path.join(__dirname, "graphql.zip"), (err) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log('Done')
                                }
                            })
                            //res.download(path.join(__dirname, `build-files${dateStamp}`))
                        })
                    }
                })
            })
        })
    })
})

app.listen(4100, () => {
    console.log('Listening on 4000')
});


function buildDirectories(dateStamp, cb) {
    fs.mkdir(path.join(__dirname, `build-files${dateStamp}`), (err) => {
        if (err) console.log(err)

        fs.mkdir(path.join(__dirname, `build-files${dateStamp}`, 'client'), (err) => {
            if (err) console.log(err)

            fs.mkdir(path.join(__dirname, `build-files${dateStamp}`, 'client', 'graphql'), (err) => {
                if (err) console.log(err)

                fs.mkdir(path.join(__dirname, `build-files${dateStamp}`, 'client', 'graphql', 'queries'), (err) => {
                    if (err) console.log(err)

                    fs.mkdir(path.join(__dirname, `build-files${dateStamp}`, 'client', 'graphql', 'mutations'), (err) => {
                        if (err) console.log(err)

                        fs.mkdir(path.join(__dirname, `build-files${dateStamp}`, 'server'), (err) => {
                            if (err) console.log(err)

                            fs.mkdir(path.join(__dirname, `build-files${dateStamp}`, 'server', 'db-Model'), (err) => {
                                if (err) console.log(err)  

                                fs.mkdir(path.join(__dirname, `build-files${dateStamp}`, 'server', 'graphql-schema'), (err) => {
                                    if (err) console.log(err)  

                                    return cb();
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

function buildClientQueries(data, dateStamp, cb) {
    
    fs.writeFile(path.join(__dirname, `build-files${dateStamp}/client/graphql/queries/index.js`), parseClientQueries(data), (err) => {
        if (err) console.log(err)

        fs.writeFile(path.join(__dirname, `build-files${dateStamp}/client/graphql/mutations/index.js`), parseClientMutations(data), (err) => {
            if (err) console.log(err)

            return cb();
        })
    })
}

function buildForMongo(data, dateStamp, cb) {
    fs.writeFile(path.join(__dirname, `build-files${dateStamp}/server/graphql-schema/index.js`), parseGraphqlMongoServer(data), (err) => {
        if (err) console.log(err)

        let indexes = Object.keys(data);

        function step(i) {
            if (i < Object.keys(data).length) {
                fs.writeFileSync(path.join(__dirname, `build-files${dateStamp}/server/db-model/${data[indexes[i]].type.toLowerCase()}.js`), parseMongoschema(data[indexes[i]]), (err) => {
                    if (err) console.log(err)

                })
                step(i + 1);
            } else {
                return cb();
            }
        }
        step(0);
    })
}
