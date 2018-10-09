const tab = `  `

function parseGraphqlServer(data, database) {
  let query = "const graphql = require('graphql');\n";

  if (database === 'MongoDB') {
    for (const prop in data) {
      query += buildDbModelRequirePaths(data[prop]);
    }
  }

if (database === 'MySQL') {
  query += "import joinMonster from 'join-monster';\n";
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
  query += "const RootQuery = new GraphQLObjectType({\n\tname: 'RootQueryType',\n\tfields: ";
  
  if (database === 'MongoDB') {
    query += '{\n'
  } else {
    query += '() => ({\n'
  }

  let firstRootLoop = true;
  for (const prop in data) {
    if (!firstRootLoop) query += ',\n';
    firstRootLoop = false;

    query += buildGraphqlRootQuery(data[prop], database);
  }
  query += `\n${tab}}`
  if (database === 'MySQL') query += ')';
  query += '\n});\n\n';

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
    let query = `const ${table.type}Type = new GraphQLObjectType({\n\tname: '${table.type}',`;

    if (database === 'MySQL') {
      const uniquKey = findUniqueForSQL(table);
      function isArray(key, pos) {
        if (Array.isArray(key)) {
          if (pos === 'front') return '[ ';
          if (pos === 'back') return ' ]'
        }
        return ''
      }

      query += `\n\tsqlTable: '${table.type.toLowerCase()}s',\n\tuniqueKey: ${isArray(uniquKey, 'front')}${uniquKey}${isArray(uniquKey, 'back')},`;
    }

    query += '\n\tfields: () => ({';

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
                    tableNum: table.fields[prop].tableNum,
                    fieldNum: table.fields[prop].fieldNum,
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
    return query += '\n\t})\n});\n\n';

    function findUniqueForSQL(table) {
      let primaryKeyName = [];
      for (let prop in table.fields) {
        if (table.fields[prop].primaryKey) {
          primaryKeyName.push(`'${table.fields[prop].name}'`)
        }
      }
      if (primaryKeyName.length === 1) return primaryKeyName[0];
      if (primaryKeyName.length > 1) return primaryKeyName;
      return //PRIMARY KEY NEEDED!!!;
    }
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
  
  if (field.relation.refType === 'one to many') {
      query += `new GraphQLList(${refTypeName}Type),`
  } else {
      query += `${refTypeName}Type,`;
  }

  if (database === 'MongoDB') {
    query += '\n\t\t\tresolve(parent, args) {\n\t\t\t\t'
    query += `return ${refTypeName}.${findDbSearchMethod(refFieldName, refFieldType, field.relation.refType)}`
    query += `(${createSearchObject(refFieldName, refFieldType, field)});\n`
  }

  if (database === 'MySQL') {
      query += `\n\t\t\tsqlJoin(${data[field.tableNum].type.toLowerCase()}Table, ${refTypeName.toLowerCase()}Table) {`;
      query += `\n\t\t\t\treturn \`\${${data[field.tableNum].type.toLowerCase()}Table}.${field.name} = \${${refTypeName.toLowerCase()}Table}.${refFieldName}\`\n`;
  }
  return query += '\n\t\t\t}\n\t\t}';

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

  if (!!data.fields[0] && database === 'MongoDb') {
    query += createFindByIdQuery(data, database);
  }

  if (database === 'MySQL') {
    query += createSQLPrimaryKeyRootQuery(data, database);
  }

  return query;
}

function createFindAllRootQuery(table, database) {
  let query = `\t\tevery${toTitleCase(table.type)}: {\n\t\t\ttype: new GraphQLList(${table.type}Type),\n\t\t\tresolve`

  if (database === 'MongoDB') {
    query += `() {\n\t\t\t\treturn ${table.type}.find({});`
  }

  if (database === 'MySQL') {
    query += `: (parent, args, context, resolveInfo) => {\n\t\t\t\treturn joinMonster(resolveInfo, context, sql => {\n\t\t\t\t\treturn knex.raw(sql)\n\t\t\t\t})`
  }

  return query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`;
}

function createFindByIdQuery(table, database) {
  const idFieldName = table.fields[0].name
  let query = `,\n\t\t${table.type.toLowerCase()}: {\n\t\t\ttype: ${table.type}Type,\n\t\t\targs: { ${idFieldName}: { type: new GraphQLNonNull(GraphQLID) }},\n\t\t\tresolve(parent, args) {\n\t\t\t\treturn ${table.type}.findById(args.id);\n\t\t\t}\n\t\t}`

  return query;
}

function createSQLPrimaryKeyRootQuery(table, database) {
  let primaryKey = '';
  const primaryKeyValue = findUniqueForSQL(table);
  if (Array.isArray(primaryKeyValue)) {
    primaryKey = primaryKeyValue[0];
  } else {
    primaryKey = primaryKeyValue;
  }

  if (primaryKey) {
    let query = `,\n\t\t${table.type.toLowerCase()}: {\n\t\t\ttype: ${table.type}Type,\n\t\t\targs: { ${primaryKey}: { type: new GraphQLNonNull(${typeCheck(primaryKey)}) }},\n\t\t\twhere: (${table.type.toLowerCase()}Table, args, context) => {\n\t\t\t\tif (args.${primaryKey}) return\`\${${table.type.toLowerCase()}Table}.${primaryKey} = \${args.${primaryKey}}\`\n\t\t\t},\n\t\t\tresolve: (parent, args, context, resolveInfo) => {\n\t\t\t\treturn joinMonster(resolveInfo, context, sql => {\n\t\t\t\t\treturn knex.raw(sql)\n\t\t\t\t})\n\t\t\t}\n\t\t}`
  
    return query;
  }
  return '';

  function findUniqueForSQL(table) {
    let primaryKeyName = [];
    for (let prop in table.fields) {
      if (table.fields[prop].primaryKey) {
        primaryKeyName.push(`${table.fields[prop].name}`)
      }
    }
    if (primaryKeyName.length === 1) return primaryKeyName[0];
    if (primaryKeyName.length > 1) return primaryKeyName;
    return //PRIMARY KEY NEEDED!!!;
  }

  function buildArgs() {

  }

  function typeCheck(value) {
    if (value === 'id') return 'GraphQLID'
    return 'GraphQLString'
  }
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