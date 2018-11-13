const fs = require('fs');
const path = require('path');

module.exports = function(database, PATH, dateStamp, cb) {
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
  
    if (database.includes('MySQL')) {
        fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/db/mysql_pool.js`));
        fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/db/mysql_scripts.sql`));
    }

    if (database.includes('PostgreSQL')) {
        fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/db/postgresql_pool.js`));
        fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/db/postgresql_scripts.sql`));
    }

    if(!database.includes('Join')) {
      fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/graphql-schema/index.js`));
      
    } else {
      fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/schema/index.js`));
      fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/resolvers/index.js`));
      fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/resolvers/join-monster-metadata.js`));
      //fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/models/index.js`));
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