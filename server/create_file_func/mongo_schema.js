function parseMongoschema(data, cb) {
    let query = `const mongoose = require('mongoose');\nconst Schema = mongoose.Schema;\n\nconst ${data.type.toLowerCase()}Schema = new Schema({\n\t`

    let firstLoop = true;
    for (let prop in data.fields) {
        if (prop !== '0') {
            if (!firstLoop) query += ',\n\t'
            firstLoop = false
    
            query += createSchemaField(data.fields[prop]);
        }
    }
  query += `\n});\n\nmodule.exports = mongoose.model("${data.type}", ${data.type.toLowerCase()}Schema);`;

  return
}

function createSchemaField(data) {
  let query = `${data.name}: ${checkForArray('start')}{\n\t\ttype: ${checkDataType(data.type)},\n\t\tunique: ${data.unique},\n\t\trequired: ${data.required}`;

  if (data.defaultValue) {
    query += `,\n\t\tdefault: "${data.defaultValue}"`;
  }

  return query += `\n\t}${checkForArray('end')}`;

  function checkForArray(position) {
    if (data.multipleValues) {
      if (position === 'start') return '[';
      if (position === 'end') return ']';
    }
    return '';
  }

  function checkDataType(type) {
    if (type === 'ID') {
      return 'String';
    }
    return type;
  }
}

module.exports = parseMongoschema;
