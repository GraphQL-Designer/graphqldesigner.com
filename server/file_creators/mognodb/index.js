const fs = require('fs');
const path = require('path');

//Function Imports
const parseMongoSchema = require('./mongo_schema');

module.exports = function(data, PATH, dateStamp) {
    const indexes = Object.keys(data);

    indexes.forEach(index => {
        fs.writeFileSync(path.join(PATH, `build-files${dateStamp}/server/db/${data[index].type.toLowerCase()}.js`), parseMongoSchema(data[index]));
    });
}