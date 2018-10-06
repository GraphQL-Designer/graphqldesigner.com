function parseGraphqlServer(data, database) {
  let query = "const graphql = require('graphql');\n";


if (database === 'MongoDB') {
  for (const prop in data) {
    query += buildDbModelRequirePaths(data[prop]);
  }
}

if (database === 'MySQL') {
  query += "const getConnection = require('../db/mysql_pool.js');\n";
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
  query += "const RootQuery = new GraphQLObjectType({\n\tname: 'RootQueryType',\n\tfields: {\n";

  let firstRootLoop = true;
  for (const prop in data) {
    if (!firstRootLoop) query += ',\n';
    firstRootLoop = false;

    query += buildGraphqlRootQury(data[prop], database);
  }
  query += '\n\t}\n});\n\n';

  // BUILD MUTATIONS
  query += "const Mutation = new GraphQLObjectType({\n\tname: 'Mutation',\n\tfields: {\n";

  let firstMutationLoop = true;
  for (const prop in data) {
    if (!firstMutationLoop) query += ',\n';
    firstMutationLoop = false;

    query += buildGraphqlMutationQury(data[prop], database);
  }
  query += '\n\t}\n});\n\n';

  query += 'module.exports = new GraphQLSchema({\n\tquery: RootQuery,\n\tmutation: Mutation\n});';
  return query;
}

function buildDbModelRequirePaths(data) {
  return `const ${data.type} = require('../db/${data.type.toLowerCase()}.js');\n`;
}

function buildGraphqlTypeSchema(table, data, database) {
    let query = `const ${table.type}Type = new GraphQLObjectType({\n\tname: '${table.type}',\n\tfields: () => ({`;

    let firstLoop = true;
    for (let prop in table.fields) {
        if (!firstLoop) query+= ',';
        firstLoop = false;

        query += `\n\t\t${table.fields[prop].name}: { type: ${checkForMultipleValues(table.fields[prop].multipleValues, 'front')}${tableTypeToGraphqlType(table.fields[prop].type)}${checkForMultipleValues(table.fields[prop].multipleValues, 'back')} }`;

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
    return query += '\n\t})\n});\n\n';
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
  let query = `,\n\t\t${createMongoSubQueryName(refTypeName)}: {\n\t\t\ttype: `
  
  if (field.relation.refType === 'one to many' || field.relation.refType === 'many to many') {
      query += `new GraphQLList(${refTypeName}Type),`
  } else {
      query += `${refTypeName}Type,`
  }
  query += '\n\t\t\tresolve(parent, args) {\n\t\t\t\t'

  if (database === 'MongoDB') {
    query += `return ${refTypeName}.${findDbSearchMethod(refFieldName, refFieldType, field.relation.refType)}(${createSearchObject(refFieldName, refFieldType, field)});`;
  }

  if (database === 'MySQL') {
    query += `getConnection((err, con) => {\n\t\t\t\t\tconst sql = \`SELECT * FROM ${refTypeName} WHERE `;

    if (field.type === 'ID') {
      query += `id = \${parent.${field.name}}`;
    } else {
      query += `${refFieldName} = \${parent.${field.name}}`;
    }
    query += '\`;\n\t\t\t\t\tcon.query(sql, (err, result) => {\n\t\t\t\t\t\tif (err) throw err;\n\t\t\t\t\t\tcon.release();\n\t\t\t\t\t\treturn result;\n\t\t\t\t\t})\n\t\t\t\t})'
  }

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
  const refType = field.relation.refType;

  if (refFieldName === 'id' || refFieldType === 'ID') {
    return `parent.${field.name}`;
  } else if (refType === 'one to one') {
    return `{ ${refFieldName}: parent.${field.name} }`;
  } else {
    return `{ ${refFieldName}: parent.${field.name} }`;
  }
}

function buildGraphqlRootQury(data, database) {
  let query = '';

  query += createFindAllRootQuery(data, database);

  if (!!data.fields[0]) {
    query += createFindByIdQuery(data, database);
  }

  return query;
}

function createFindAllRootQuery(table, database) {
  let query = `\t\tevery${toTitleCase(table.type)}s: {\n\t\t\ttype: new GraphQLList(${table.type}Type),\n\t\t\tresolve() {\n\t\t\t\t`

  if (database === 'MongoDB') {
    query += `return ${table.type}.find({});`
  }

  if (database === 'MySQL') {
    query += `getConnection((err, con) => {\n\t\t\t\t\tconst sql = \'SELECT * FROM ${table.type}\';\n\t\t\t\t\tcon.query(sql, (err, results) => {\n\t\t\t\t\t\tif (err) throw err;\n\t\t\t\t\t\tcon.release();\n\t\t\t\t\t\treturn results;\n\t\t\t\t\t})\n\t\t\t\t})`
  }

  return query += '\n\t\t\t}\n\t\t}';
}

function createFindByIdQuery(table, database) {
  let query = `,\n\t\t${table.type.toLowerCase()}: {\n\t\t\ttype: ${table.type}Type,\n\t\t\targs: { id: { type: GraphQLID }},\n\t\t\tresolve(parent, args) {\n\t\t\t\t`;

  if (database === 'MongoDB') {
    query += `return ${table.type}.findById(args.id);`
  }

  if (database === 'MySQL') {
    query += `getConnection((err, con) => {\n\t\t\t\t\tconst sql = \`SELECT * FROM ${table.type} WHERE id = \${args.id}\`;\n\t\t\t\t\tcon.query(sql, (err, result) => {\n\t\t\t\t\t\tif (err) throw err;\n\t\t\t\t\t\tcon.release();\n\t\t\t\t\t\treturn result;\n\t\t\t\t\t})\n\t\t\t\t})`
  }

  return query += '\n\t\t\t}\n\t\t}';
}

function buildGraphqlMutationQury(table, database) {
  return `${addMutation(table, database)},\n${updateMutation(table, database)},\n${deleteMutation(table, database)}` 
}

function addMutation(table, database) {
  let query = `\t\tadd${table.type}: {\n\t\t\ttype: ${table.type}Type,\n\t\t\targs: {\n`;

  let firstLoop = true;
  for (const prop in table.fields) {
    if (!firstLoop) query += ',\n';
    firstLoop = false;

    query += `\t\t\t\t${table.fields[prop].name}: ${buildMutationArgType(table.fields[prop])}`;
  }

  query += `\n\t\t\t},\n\t\t\tresolve(parent, args) {\n\t\t\t\t`
  
  if (database === 'MongoDB') query += `const ${table.type.toLowerCase()} = new ${table.type}(args);\n\t\t\t\treturn ${table.type.toLowerCase()}.save();`;

  if (database === 'MySQL') {
    query += `getConnection((err, con) => {\n\t\t\t\t\tconst sql = 'INSERT INTO ${table.type} SET ?';\n\t\t\t\t\tcon.query(sql, args, (err, result) => {\n\t\t\t\t\t\tif (err) throw err;\n\t\t\t\t\t\tcon.release();\n\t\t\t\t\t\treturn result;\n\t\t\t\t\t})\n\t\t\t\t})`
  }

  return query += '\n\t\t\t}\n\t\t}'

  function buildMutationArgType(field) {
    const query = `{ type: ${checkForRequired(field.required, 'front')}${checkForMultipleValues(field.multipleValues, 'front')}${tableTypeToGraphqlType(field.type)}${checkForMultipleValues(field.multipleValues, 'back')}${checkForRequired(field.required, 'back')} }`;

    return query;
  }
}

function updateMutation(table, database) {
  let query = `\t\tupdate${table.type}: {\n\t\t\ttype: ${table.type}Type,\n\t\t\targs: {\n`;

  let firstLoop = true;
  for (const prop in table.fields) {
    if (!firstLoop) query += ',\n';
    firstLoop = false;

    query += `\t\t\t\t${table.fields[prop].name}: ${buildMutationArgType(table.fields[prop])}`;
  }

  query += `\n\t\t\t},\n\t\t\tresolve(parent, args) {\n\t\t\t\t`

  if (database === 'MongoDB') query += `return ${table.type}.findByIdAndUpdate(args.id, args);`;

  if (database === 'MySQL') {
    query += `getConnection((err, con) => {\n\t\t\t\t\tlet updateValues = '';\n\t\t\t\t\tfor (const prop in args) {\n\t\t\t\t\t\tupdateValues += \`\${prop} = '\${args[prop]}' \`\n\t\t\t\t\t}\n\t\t\t\t\tconst sql = \`UPDATE ${table.type} SET \${updateValues}WHERE id = \${args.id}\`;\n\t\t\t\t\tcon.query(sql, args, (err, result) => {\n\t\t\t\t\t\tif (err) throw err;\n\t\t\t\t\t\tcon.release();\n\t\t\t\t\t\treturn result;\n\t\t\t\t\t})\n\t\t\t\t})`
  }

  return query += '\n\t\t\t}\n\t\t}';

  function buildMutationArgType(field, database) {
    const query = `{ type: ${checkForMultipleValues(field.multipleValues, 'front')}${tableTypeToGraphqlType(field.type)}${checkForMultipleValues(field.multipleValues, 'back')} }`;

    return query
  }
}

function deleteMutation(table, database) {
  let query = `\t\tdelete${table.type}: {\n\t\t\ttype: ${table.type}Type,\n\t\t\targs: { id: { type: GraphQLID }},\n\t\t\tresolve(parent, args) {\n\t\t\t\t`

  if (database === 'MongoDB') query += `return ${table.type}.findByIdAndRemove(args.id);`

  if (database === 'MySQL') {
    query += `getConnection((err, con) => {\n\t\t\t\t\tconst sql = \`DELETE FROM ${table.type} WHERE id = \${args.id}\`;\n\t\t\t\t\tcon.query(sql, (err, result) => {\n\t\t\t\t\t\tif (err) throw err;\n\t\t\t\t\t\tcon.release();\n\t\t\t\t\t\treturn result;\n\t\t\t\t\t})\n\t\t\t\t})`
  }

  return query += '\n\t\t\t}\n\t\t}';
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