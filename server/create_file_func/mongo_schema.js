function parseMongoschema(data) {
    let query = `const mongoose = require('mongoose');\nconst Schema = mongoose.Schema;\n\nconst ${data.type.toLowerCase()}Schema = new Schema({\n\t`

    let firstLoop = true;
    for (let prop in data.fields) {
        if (!firstLoop) query += ',\n\t'
        firstLoop = false

        query += createSchemaField(data.fields[prop]);
    }

    query += `\n});\n\nmodule.exports = mongoose.model("${data.type}", ${data.type.toLowerCase()}Schema);`

    return query;
}

function createSchemaField(data) {
    const keys = Object.keys(data);
    const values = Object.values(data)

    function checkForArray(position) {
        if (values[5]) {
            if( position === 'start') return '['
            if( position === 'end') return ']'
        }
        return ''
    }

    let query = `${values[0]}: ${checkForArray('start')}{\n\t\t${keys[1]}: ${values[1]},\n\t\tunique: ${values[3]},\n\t\trequired: ${values[6]}`;

    if (values[4]) {
        query += `,\n\t\tdefault: "${values[4]}"`
    }

    return query += `\n\t}${checkForArray('end')}`
}

module.exports = parseMongoschema;