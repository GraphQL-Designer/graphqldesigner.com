const fs = require('fs');
const path = require('path');

module.exports = function(database, PATH, dateStamp, cb) {
    if (!database.includes('Join')) {
      fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'graphql-schema'));
      
    } else {
      fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'schema'));
      fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'resolvers'));
      //fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, 'server', 'models'));
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