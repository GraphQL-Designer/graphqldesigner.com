const tab = `  `

function parseGraphqlServer(data, database) {
  let query = "const graphql = require('graphql');\n";

  if (database === 'MongoDB') {
    for (const prop in data) {
      query += buildDbModelRequirePaths(data[prop]);
    }
  }
  
  if (database === 'MySQL') {
    query += `const getConnection = require('../db/mysql_pool.js');\n`;
  }
  
  query += `
const { 
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString, 
  GraphQLInt, 
  GraphQLList,
  GraphQLNonNull
} = graphql;
\n`;

  // BUILD TYPE SCHEMA
  for (const prop in data) {
    query += buildGraphqlTypeSchema(data[prop], data, database);
  }

  // BUILD ROOT QUERY
  query += `const RootQuery = new GraphQLObjectType({\n${tab}name: 'RootQueryType',\n${tab}fields: {\n`;

  let firstRootLoop = true;
  for (const prop in data) {
    if (!firstRootLoop) query += ',\n';
    firstRootLoop = false;

    query += buildGraphqlRootQuery(data[prop], database);
  }
  query += `\n${tab}}\n});\n\n`;

  // BUILD MUTATIONS
  query += `const Mutation = new GraphQLObjectType({\n${tab}name: 'Mutation',\n${tab}fields: {\n`;

  let firstMutationLoop = true;
  for (const prop in data) {
    if (!firstMutationLoop) query += ',\n';
    firstMutationLoop = false;

    query += buildGraphqlMutationQuery(data[prop], database);
  }
  query += `\n${tab}}\n});\n\n`;

  query += `module.exports = new GraphQLSchema({\n${tab}query: RootQuery,\n${tab}mutation: Mutation\n});`;
  return query;
}

function buildDbModelRequirePaths(data) {
  return `const ${data.type} = require('../db/${data.type.toLowerCase()}.js');\n`;
}

function buildGraphqlTypeSchema(table, data, database) {
    let query = `const ${table.type}Type = new GraphQLObjectType({\n${tab}name: '${table.type}',\n${tab}fields: () => ({`;

    let firstLoop = true;
    for (let prop in table.fields) {
        if (!firstLoop) query+= ',';
        firstLoop = false;

        query += `\n${tab}${tab}${table.fields[prop].name}: { type: ${checkForMultipleValues(table.fields[prop].multipleValues, 'front')}${tableTypeToGraphqlType(table.fields[prop].type)}${checkForMultipleValues(table.fields[prop].multipleValues, 'back')} }`;

        if (table.fields[prop].relation.tableIndex > -1) {
            query += createSubQuery(table.fields[prop], data, database);
        }

        const refBy = table.fields[prop].refBy;
        if (Array.isArray(refBy)) {
            refBy.forEach(value => {
                const parsedValue = value.split('.');
                const field = {
                    name: table.fields[prop].name,
                    relation: {
                        tableIndex: parsedValue[0],
                        fieldIndex: parsedValue[1],
                        refType: parsedValue[2],
                        type: table.fields[prop].type
                    }
                };
                query += createSubQuery(field, data, database);
            });
        }
    }
    return query += `\n${tab}})\n});\n\n`;
}

function tableTypeToGraphqlType(type) {
  switch (type) {
    case 'ID':
      return 'GraphQLID';
    case 'String':
      return 'GraphQLString';
    case 'Number':
      return 'GraphQLInt';
    case 'Boolean':
      return 'GraphQLBoolean';
    case 'Float':
      return 'GraphQLFloat';
    default:
      return 'GraphQLString';
  }
}

function toTitleCase(refTypeName) {
  let name = refTypeName[0].toUpperCase();
  name += refTypeName.slice(1).toLowerCase();
  return name;
}

function createSubQuery(field, data, database) {
  const refTypeName = data[field.relation.tableIndex].type;
  const refFieldName = data[field.relation.tableIndex].fields[field.relation.fieldIndex].name;
  const refFieldType = data[field.relation.tableIndex].fields[field.relation.fieldIndex].type;
  let query = `,\n${tab}${tab}${createSubQueryName(refTypeName)}: {\n${tab}${tab}${tab}type: `
  
  if (field.relation.refType === 'one to many' || field.relation.refType === 'many to many') {
      query += `new GraphQLList(${refTypeName}Type),`;
  } else {
      query += `${refTypeName}Type,`;
  }
  query += `\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`;

  if (database === 'MongoDB') {
    query += `return ${refTypeName}.${findDbSearchMethod(refFieldName, refFieldType, field.relation.refType)}`
    query += `(${createSearchObject(refFieldName, refFieldType, field)});\n`
    query += `${tab}${tab}${tab}}\n`
    query += `${tab}${tab}}`
  }

  if (database === 'MySQL') {
    query += `getConnection((err, con) => {\n${tab}${tab}${tab}${tab}${tab}const sql = \`SELECT * FROM ${refTypeName} WHERE `;

    if (field.type === 'ID') {
      query += `${field.name} = \${parent.${field.name}}`;
    } else {
      query += `${refFieldName} = \${parent.${field.name}}`;
    }
    query += `\`;\n${tab}${tab}${tab}${tab}${tab}con.query(sql, (err, result) => {\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}con.release();\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return result;\n`
    query += `${tab}${tab}${tab}${tab}${tab}})\n`
    query += `${tab}${tab}${tab}${tab}})\n`
    query += `${tab}${tab}${tab}}\n`
    query += `${tab}${tab}}`
  }
  return query; 

  function createSubQueryName() {
    switch (field.relation.refType) {
      case 'one to one':
        return `related${toTitleCase(refTypeName)}`;
      case 'one to many':
        return `everyRelated${toTitleCase(refTypeName)}`;
      case 'many to one':
        return `related${toTitleCase(refTypeName)}`;
      case 'many to many':
        return `everyRelated${toTitleCase(refTypeName)}`;
      default:
        return `everyRelated${toTitleCase(refTypeName)}`;
      }
  }
}

function findDbSearchMethod(refFieldName, refFieldType, refType) {
  if (refFieldName === 'id' || refFieldType === 'ID') return 'findById';
  switch (refType) {
    case 'one to one':
      return 'findOne';
    case 'one to many':
      return 'find';
    case 'many to one':
      return 'find';
    case 'many to many':
      return 'find';
    default:
      return 'find';
  }
}

function createSearchObject(refFieldName, refFieldType, field) {
  if (refFieldName === 'id' || refFieldType === 'ID') {
    return `parent.${field.name}`;
  } else {
    return `{ ${refFieldName}: parent.${field.name} }`;
  }
}

function buildGraphqlRootQuery(data, database) {
  let query = '';

  query += createFindAllRootQuery(data, database);

  if (!!data.fields[0]) {
    query += createFindByIdQuery(data, database);
  }

  return query;
}

function createFindAllRootQuery(table, database) {
  let query = `${tab}${tab}every${toTitleCase(table.type)}: {\n${tab}${tab}${tab}type: new GraphQLList(${table.type}Type),\n${tab}${tab}${tab}resolve() {\n${tab}${tab}${tab}${tab}`

  if (database === 'MongoDB') {
    query += `return ${table.type}.find({});`
  }

  if (database === 'MySQL') {
    query += `getConnection((err, con) => {\n${tab}${tab}${tab}${tab}${tab}const sql = \'SELECT * FROM ${table.type}\';\n${tab}${tab}${tab}${tab}${tab}con.query(sql, (err, results) => {\n${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;\n${tab}${tab}${tab}${tab}${tab}${tab}con.release();\n${tab}${tab}${tab}${tab}${tab}${tab}return results;\n${tab}${tab}${tab}${tab}${tab}})\n${tab}${tab}${tab}${tab}})`
  }

  return query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`;
}

function createFindByIdQuery(table, database) {
  const idFieldName = table.fields[0].name
  let query = `,\n${tab}${tab}${table.type.toLowerCase()}: {\n${tab}${tab}${tab}type: ${table.type}Type,\n${tab}${tab}${tab}args: { ${idFieldName}: { type: GraphQLID }},\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`;

  if (database === 'MongoDB') {
    query += `return ${table.type}.findById(args.id);`
  }

  if (database === 'MySQL') {
    query += `getConnection((err, con) => {\n`
    query += `${tab}${tab}${tab}${tab}${tab}const sql = \`SELECT * FROM ${table.type} WHERE ${idFieldName} = \${args.${idFieldName}}\`;\n`
    query += `${tab}${tab}${tab}${tab}${tab}con.query(sql, (err, result) => {\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}con.release();\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return result;\n`
    query += `${tab}${tab}${tab}${tab}${tab}})\n`
    query += `${tab}${tab}${tab}${tab}})`
  }

  return query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`;
}

function buildGraphqlMutationQuery(table, database) {
  let string = ``;
  string += `${addMutation(table, database)}`
  if (table.fields[0]) {
    string += `,\n${updateMutation(table, database)},\n`
    string += `${deleteMutation(table, database)}` 
  }
  return string; 
}

function addMutation(table, database) {
  let query = `${tab}${tab}add${table.type}: {\n${tab}${tab}${tab}type: ${table.type}Type,\n${tab}${tab}${tab}args: {\n`;

  let firstLoop = true;
  for (const prop in table.fields) {
    if (!firstLoop) query += ',\n';
    firstLoop = false;

    query += `${tab}${tab}${tab}${tab}${table.fields[prop].name}: ${buildMutationArgType(table.fields[prop])}`;
  }

  query += `\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`
  
  if (database === 'MongoDB') query += `const ${table.type.toLowerCase()} = new ${table.type}(args);\n${tab}${tab}${tab}${tab}return ${table.type.toLowerCase()}.save();`;

  if (database === 'MySQL') {
    query += `getConnection((err, con) => {\n${tab}${tab}${tab}${tab}${tab}const sql = 'INSERT INTO ${table.type} SET ?';\n${tab}${tab}${tab}${tab}${tab}con.query(sql, args, (err, result) => {\n${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;\n${tab}${tab}${tab}${tab}${tab}${tab}con.release();\n${tab}${tab}${tab}${tab}${tab}${tab}return result;\n${tab}${tab}${tab}${tab}${tab}})\n${tab}${tab}${tab}${tab}})`
  }

  return query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`

  function buildMutationArgType(field) {
    const query = `{ type: ${checkForRequired(field.required, 'front')}${checkForMultipleValues(field.multipleValues, 'front')}${tableTypeToGraphqlType(field.type)}${checkForMultipleValues(field.multipleValues, 'back')}${checkForRequired(field.required, 'back')} }`;

    return query;
  }
}

function updateMutation(table, database) {
  let query = `${tab}${tab}update${table.type}: {\n${tab}${tab}${tab}type: ${table.type}Type,\n${tab}${tab}${tab}args: {\n`;

  let firstLoop = true;
  for (const prop in table.fields) {
    if (!firstLoop) query += ',\n';
    firstLoop = false;

    query += `${tab}${tab}${tab}${tab}${table.fields[prop].name}: ${buildMutationArgType(table.fields[prop])}`;
  }

  query += `\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`

  if (database === 'MongoDB') query += `return ${table.type}.findByIdAndUpdate(args.id, args);`;

  if (database === 'MySQL') {
    const idFieldName = table.fields[0].name; 
  
    query += `getConnection((err, con) => {\n`
    query += `${tab}${tab}${tab}${tab}${tab}let updateValues = '';\n`
    query += `${tab}${tab}${tab}${tab}${tab}for (const prop in args) {\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}updateValues += \`\${prop} = '\${args[prop]}' \`\n`
    query += `${tab}${tab}${tab}${tab}${tab}}\n`
    query += `${tab}${tab}${tab}${tab}${tab}const sql = \`UPDATE ${table.type} SET \${updateValues} WHERE ${idFieldName} = \${args.`
    query += `${idFieldName}}\`;\n`
    query += `${tab}${tab}${tab}${tab}${tab}con.query(sql, args, (err, result) => {\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}con.release();\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return result;\n`
    query += `${tab}${tab}${tab}${tab}${tab}})\n`
    query += `${tab}${tab}${tab}${tab}})`
  }

  return query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`;

  function buildMutationArgType(field, database) {
    const query = `{ type: ${checkForMultipleValues(field.multipleValues, 'front')}${tableTypeToGraphqlType(field.type)}${checkForMultipleValues(field.multipleValues, 'back')} }`;

    return query
  }
}

function deleteMutation(table, database) {
  const idFieldName = table.fields[0].name
  let query = `${tab}${tab}delete${table.type}: {\n${tab}${tab}${tab}type: ${table.type}Type,\n${tab}${tab}${tab}args: { ${idFieldName}: { type: GraphQLID }},\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`

  if (database === 'MongoDB') query += `return ${table.type}.findByIdAndRemove(args.id);`

  if (database === 'MySQL') {
    const idFieldName = table.fields[0].name

    query += `getConnection((err, con) => {\n`
    query += `${tab}${tab}${tab}${tab}${tab}const sql = \`DELETE FROM ${table.type} WHERE ${idFieldName} = \${args.`
    query += `${idFieldName}}\`;\n`
    query += `${tab}${tab}${tab}${tab}${tab}con.query(sql, (err, result) => {\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}con.release();\n`
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return result;\n`
    query += `${tab}${tab}${tab}${tab}${tab}})\n`
    query += `${tab}${tab}${tab}${tab}})`
  }

  return query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`;
}

function checkForRequired(required, position) {
  if (required) {
    if (position === 'front') {
      return 'new GraphQLNonNull(';
    }
    return ')';
  }
  return '';
}

function checkForMultipleValues(multipleValues, position) {
  if (multipleValues) {
    if (position === 'front') {
      return 'new GraphQLList(';
    }
    return ')';
  }
  return '';
}

module.exports = parseGraphqlServer;