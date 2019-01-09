const tab = `  `;

function parseGraphqlServer(tables, database) {
  let query = '';
  query += buildRequireStatements(tables, database);
  query += buildGraphqlVariables();

  // BUILD TYPE SCHEMA
  for (const tableIndex in tables) {
    query += buildGraphqlTypeSchema(tables[tableIndex], tables, database);
  }

  // BUILD ROOT QUERY
  query += `const RootQuery = new GraphQLObjectType({\n${tab}name: 'RootQueryType',\n${tab}fields: {\n`;

  let firstRootLoop = true;
  for (const tableIndex in tables) {
    if (!firstRootLoop) query += ',\n';
    firstRootLoop = false;

    query += buildGraphqlRootQuery(tables[tableIndex], database);
  }
  query += `\n${tab}}\n});\n\n`;

  // BUILD MUTATIONS
  query += `const Mutation = new GraphQLObjectType({\n${tab}name: 'Mutation',\n${tab}fields: {\n`;

  let firstMutationLoop = true;
  for (const tableIndex in tables) {
    if (!firstMutationLoop) query += ',\n';
    firstMutationLoop = false;

    query += buildGraphqlMutationQuery(tables[tableIndex], database);
  }
  query += `\n${tab}}\n});\n\n`;

  query += `module.exports = new GraphQLSchema({\n${tab}query: RootQuery,\n${tab}mutation: Mutation\n});`;
  return query;
}


/**
 * @param {String} database - Represents the database selected (MongoDB, MySQL, or PostgreSQL)
 * @returns {String} - All the require statements needed for the GraphQL server.
 */
function buildRequireStatements(tables, database) {
  let requireStatements = "const graphql = require('graphql');\n";

  if (database === 'MongoDB') {
    for (const tableIndex in tables) {
      requireStatements += `const ${tables[tableIndex].type} = require('../db/${tables[tableIndex].type.toLowerCase()}.js');\n`;
    }
  } else {
    requireStatements += `const pool = require('../db/sql_pool.js');\n`;
  }
  return requireStatements;
}


/**
 * @returns {String} - all constants needed for a GraphQL server
 */
function buildGraphqlVariables() {
  return `
const { 
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString, 
  GraphQLInt, 
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull
} = graphql;
  \n`
}


/**
 * @param {Object} table - table being interated on. Each table consists of fields
 * @param {Object} tables - an object of all the tables created in the application
 * @param {String} database - Database selected (MongoDB, MySQL, or PostgreSQL)
 * @returns {String} - The GraphQL type code for the inputted table
 */
function buildGraphqlTypeSchema(table, tables, database) {
  let query = `const ${table.type}Type = new GraphQLObjectType({\n`;
  query += `${tab}name: '${table.type}',\n`;
  query += `${tab}fields: () => ({`;
  query += buildGraphQLTypeFields(table, tables, database);
  return query += `\n${tab}})\n});\n\n`;
}


/**
 * @param {Object} table - table being interated on. Each table consists of fields
 * @param {Object} tables - an object of all the tables created in the application
 * @param {String} database - Database selected (MongoDB, MySQL, or PostgreSQL)
 * @returns {String} - each field for the GraphQL type. 
 */
function buildGraphQLTypeFields(table, tables, database) {
  let query = ''; 
  let firstLoop = true;
  for (let fieldIndex in table.fields) {
    if (!firstLoop) query+= ',';
    firstLoop = false;

    query += `\n${tab}${tab}${buildFieldItem(table.fields[fieldIndex])}`;
    // check if the field has a relation to another field
    if (table.fields[fieldIndex].relation.tableIndex > -1) {
      query += createSubQuery(table.fields[fieldIndex], tables, database);
    }

    // check if the field is a relation for another field
    const refBy = table.fields[fieldIndex].refBy;
    if (Array.isArray(refBy)) {
      refBy.forEach(value => {
        const parsedValue = value.split('.');
        const field = {
          name: table.fields[fieldIndex].name,
          relation: {
            tableIndex: parsedValue[0],
            fieldIndex: parsedValue[1],
            refType: parsedValue[2],
            type: table.fields[fieldIndex].type
          }
        };
        query += createSubQuery(field, tables, database);
      });
    }
  }
  return query; 
}


/**
 * @param {Object} field - an object containing all the information for the field being iterated on
 * @returns {String} - a field item (ex: 'id: { type: GraphQLID }')
 */
function buildFieldItem(field) {
  return  `${field.name}: { type: ${checkForRequired(field.required, 'front')}${checkForMultipleValues(field.multipleValues, 'front')}${tableTypeToGraphqlType(field.type)}${checkForMultipleValues(field.multipleValues, 'back')}${checkForRequired(field.required, 'back')} }`;
}


/**
 * @param {String} type - the field type (ID, String, Number, Boolean, or Float)
 * @returns {String} - the GraphQL type associated with the field type entered
 */
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


/**
 * @param {String} refTypeName - Any string inputted
 * @returns {String} - The string inputted, but with the first letter capitalized and the rest lowercased
 */
function toTitleCase(refTypeName) {
  let name = refTypeName[0].toUpperCase();
  name += refTypeName.slice(1).toLowerCase();
  return name;
}

/**
 * @param {Object} field - field being iterated on
 * @param {Object} tables - all the tables made by the user. 
 * @param {String} database - Datbase selected
 * @returns {String} - Builds a sub type for any field with a relation. 
 */
function createSubQuery(field, tables, database) {
  const refTypeName = tables[field.relation.tableIndex].type;
  const refFieldName = tables[field.relation.tableIndex].fields[field.relation.fieldIndex].name;
  const refFieldType = tables[field.relation.tableIndex].fields[field.relation.fieldIndex].type;
  let query = `,\n${tab}${tab}${createSubQueryName(field, refTypeName)}: {\n${tab}${tab}${tab}type: `;

  if (field.relation.refType === 'one to many' || field.relation.refType === 'many to many') {
    query += `new GraphQLList(${refTypeName}Type),`;
  } else {
    query += `${refTypeName}Type,`;
  }
  query += `\n${tab}${tab}${tab}resolve(parent, args) {\n`;

  if (database === 'MongoDB') {
    query += `${tab}${tab}${tab}${tab}return ${refTypeName}.${findDbSearchMethod(refFieldName, refFieldType, field.relation.refType)}`;
    query += `(${createSearchObject(refFieldName, refFieldType, field)});\n`;
    query += `${tab}${tab}${tab}}\n`;
    query += `${tab}${tab}}`;
  }

  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += `${tab}${tab}${tab}${tab}const sql = \`SELECT * FROM "${refTypeName}" WHERE "${refFieldName}" = '\${parent.${field.name}}';\`\n`
    query += buildSQLPoolQuery(field.relation.refType)
    query += `${tab}${tab}${tab}}\n`;
    query += `${tab}${tab}}`;
  }
  return query;
}

/**
 * @param {String} refType - The relation type of the sub query
 * @returns {String} - the code for a SQL pool query. 
 */
function buildSQLPoolQuery(refType) {
  let rows = ''; 
  if (refType === 'one to one' || refType === 'many to one') rows = 'rows[0]'
  else rows = 'rows'

  let query = `${tab}${tab}${tab}${tab}return pool.query(sql)\n`
     query += `${tab}${tab}${tab}${tab}${tab}.then(res => res.${rows})\n`
     query += `${tab}${tab}${tab}${tab}${tab}.catch(err => console.log('Error: ', err))\n`
  return query; 
}

function createSubQueryName(field, refTypeName) {
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

function findDbSearchMethod(refFieldName, refFieldType, refType) {
  if (refFieldName === 'id' || refFieldType === 'ID') return 'findById';
  else if (refType === 'one to one') return 'findOne';
  else return 'find';
}

function createSearchObject(refFieldName, refFieldType, field) {
  if (refFieldName === 'id' || refFieldType === 'ID') {
    return `parent.${field.name}`;
  } else {
    return `{ ${refFieldName}: parent.${field.name} }`;
  }
}

function buildGraphqlRootQuery(table, database) {
  let query = '';

  query += createFindAllRootQuery(table, database);

  if (!!table.fields[0]) {
    query += createFindByIdQuery(table, database);
  }

  return query;
}

function createFindAllRootQuery(table, database) {
  let query = `${tab}${tab}every${toTitleCase(table.type)}: {\n`
     query += `${tab}${tab}${tab}type: new GraphQLList(${table.type}Type),\n`
     query += `${tab}${tab}${tab}resolve() {\n`;

  if (database === 'MongoDB') {
    query += `${tab}${tab}${tab}${tab}return ${table.type}.find({});\n`;
  }

  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += `${tab}${tab}${tab}${tab}const sql = \`SELECT * FROM "${table.type}";\`\n`;
    query += buildSQLPoolQuery('many')
  }

  return query += `${tab}${tab}${tab}}\n${tab}${tab}}`;
}

/**
 * @param {Object} table - table being iterated on
 * @param {String} database - database selected
 * @returns {String} - root query code to find an individual type
 */
function createFindByIdQuery(table, database) {
  const idFieldName = table.fields[0].name;
  let query = `,\n${tab}${tab}${table.type.toLowerCase()}: {\n`;
  query += `${tab}${tab}${tab}type: ${table.type}Type,\n`;
  query += `${tab}${tab}${tab}args: { ${idFieldName}: { type: ${tableTypeToGraphqlType(table.fields[0].type)}}},\n`;
  query += `${tab}${tab}${tab}resolve(parent, args) {\n`;

  if (database === 'MongoDB') {
    query += `${tab}${tab}${tab}${tab}return ${table.type}.findById(args.id);\n`;
  }
  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += `${tab}${tab}${tab}${tab}const sql = \`SELECT * FROM "${table.type}" WHERE ${idFieldName} = '\${args.id}';\`;\n`
    query += buildSQLPoolQuery('one to one'); 
  }

  return query += `${tab}${tab}${tab}}\n${tab}${tab}}`;
}

function buildGraphqlMutationQuery(table, database) {
  let string = ``;
  string += `${addMutation(table, database)}`;
  if (table.fields[0]) {
    string += `,\n${updateMutation(table, database)},\n`;
    string += `${deleteMutation(table, database)}`;
  }
  return string;
}

function buildSQLPoolMutation() {
  let string = ``;
  string += `${tab}${tab}${tab}${tab}return pool.connect()\n`
  string += `${tab}${tab}${tab}${tab}${tab}.then(client => {\n`
  string += `${tab}${tab}${tab}${tab}${tab}${tab}return client.query(sql)\n`
  string += `${tab}${tab}${tab}${tab}${tab}${tab}${tab}.then(res => {\n`
  string += `${tab}${tab}${tab}${tab}${tab}${tab}${tab}${tab}client.release();\n`
  string += `${tab}${tab}${tab}${tab}${tab}${tab}${tab}${tab}return res.rows[0];\n`
  string += `${tab}${tab}${tab}${tab}${tab}${tab}${tab}})\n`
  string += `${tab}${tab}${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`
  string += `${tab}${tab}${tab}${tab}${tab}${tab}${tab}${tab}client.release();\n`
  string += `${tab}${tab}${tab}${tab}${tab}${tab}${tab}${tab}console.log('Error: ', err);\n`
  string += `${tab}${tab}${tab}${tab}${tab}${tab}${tab}})\n`
  string += `${tab}${tab}${tab}${tab}${tab}})\n`
  return string; 
}

function addMutation(table, database) {
  let query = `${tab}${tab}add${table.type}: {\n`
     query += `${tab}${tab}${tab}type: ${table.type}Type,\n`
     query += `${tab}${tab}${tab}args: {\n`;

  let firstLoop = true;
  for (const fieldIndex in table.fields) {
    if (!firstLoop) query += ',\n';
    firstLoop = false;

    query += `${tab}${tab}${tab}${tab}${buildFieldItem(table.fields[fieldIndex])}`;
  }
  query += `\n${tab}${tab}${tab}},\n`
  query += `${tab}${tab}${tab}resolve(parent, args) {\n`;

  if (database === 'MongoDB') {
    query += `${tab}${tab}${tab}${tab}const ${table.type.toLowerCase()} = new ${table.type}(args);\n`
    query += `${tab}${tab}${tab}${tab}return ${table.type.toLowerCase()}.save();\n`;
  }

  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += `${tab}${tab}${tab}${tab}const columns = Object.keys(args).map(el => \`"\${el}"\`);\n`
    query += `${tab}${tab}${tab}${tab}const values = Object.values(args).map(el => \`'\${el}'\`);\n`
    query += `${tab}${tab}${tab}${tab}const sql = \`INSERT INTO "${table.type}" (\${columns}) VALUES (\${values}) RETURNING *\`;\n`
    query += buildSQLPoolMutation(); 
  }

  return query += `${tab}${tab}${tab}}\n${tab}${tab}}`;
}

function updateMutation(table, database) {
  let query = `${tab}${tab}update${table.type}: {\n${tab}${tab}${tab}type: ${table.type}Type,\n${tab}${tab}${tab}args: {\n`;

  let firstLoop = true;
  for (const fieldIndex in table.fields) {
    if (!firstLoop) query += ',\n';
    firstLoop = false;

    query += `${tab}${tab}${tab}${tab}${buildFieldItem(table.fields[fieldIndex])}`
  }

  query += `\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n`;

  if (database === 'MongoDB') query += `${tab}${tab}${tab}${tab}return ${table.type}.findByIdAndUpdate(args.id, args);\n`;

  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += `${tab}${tab}${tab}${tab}let updateValues = '';\n`
    query += `${tab}${tab}${tab}${tab}for (const prop in args) {\n`
    query += `${tab}${tab}${tab}${tab}${tab}if (updateValues.length > 0) updateValues += \`, \`;\n`
    query += `${tab}${tab}${tab}${tab}${tab}updateValues += \`"\${prop}" = '\${args[prop]}' \`;\n`    
    query += `${tab}${tab}${tab}${tab}}\n`
    query += `${tab}${tab}${tab}${tab}const sql = \`UPDATE "${table.type}" SET \${updateValues} WHERE id = '\${args.id}' RETURNING *;\`\n`;
    query += buildSQLPoolMutation(); 
  }
  return query += `${tab}${tab}${tab}}\n${tab}${tab}}`;
}

function deleteMutation(table, database) {
  const idFieldName = table.fields[0].name;
  let query = `${tab}${tab}delete${table.type}: {\n`
     query += `${tab}${tab}${tab}type: ${table.type}Type,\n`
     query += `${tab}${tab}${tab}args: { ${idFieldName}: { type: ${tableTypeToGraphqlType(table.fields[0].type) }}},\n`
     query += `${tab}${tab}${tab}resolve(parent, args) {\n`;

  if (database === 'MongoDB') {
    query += `${tab}${tab}${tab}${tab}return ${table.type}.findByIdAndRemove(args.id);\n`;
  }

  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += `${tab}${tab}${tab}${tab}const sql = \`DELETE FROM "${table.type}" WHERE id = '\${args.id}' RETURNING *;\`\n`;
    query += buildSQLPoolMutation(); 
  }

  return query += `${tab}${tab}${tab}}\n${tab}${tab}}`;
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
