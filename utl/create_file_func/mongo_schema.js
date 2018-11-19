function parseMongoSchema(data) {
  const tab = `  `;
  let query = `const mongoose = require('mongoose');\nconst Schema = mongoose.Schema;\n\nconst ${data.type.toLowerCase()}Schema = new Schema({\n${tab}`;

  let firstLoop = true;
  for (let prop in data.fields) {
    if (prop !== '0') {
      if (!firstLoop) query += `,\n${tab}`;
      firstLoop = false;
      query += createSchemaField(data.fields[prop]);
    }
  }
  query += `\n});\n\nmodule.exports = mongoose.model("${data.type}", ${data.type.toLowerCase()}Schema);`;
  return query;
}

function createSchemaField(data) {
  const tab = `  `;
  let query = `${data.name}: ${checkForArray('start')}{\n${tab}${tab}type: ${checkDataType(data.type)},\n${tab}${tab}unique: ${data.unique},\n${tab}${tab}required: ${data.required}`;

  if (data.defaultValue) {
    query += `,\n${tab}${tab}default: "${data.defaultValue}"`;
  }

  return query += `\n${tab}}${checkForArray('end')}`;

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

module.exports = parseMongoSchema;
