const fs = require('fs');
const path = require('path');

module.exports = function(database, PATH, dateStamp, cb) {
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`));
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client'));
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql'));
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql', 'queries'));
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'graphql', 'mutations'));
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'client', 'components'));
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server'));
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'db'));
    fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'public'));

    if (!database.includes('Join')) {
        fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'graphql-schema'));

    } else {
        fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'schema'));
        fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'resolvers'));
        //fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'models'));
    }

    return cb();
}