import React from 'react';
import { connect } from 'react-redux';
import '../code.css';

const mapStateToProps = store => ({
  database: store.schema.database,
  tables: store.schema.tables,
});

const CodeServerContainer = (props) => {
  const enter = `
`;
  const tab = '  ';

  function parseGraphqlServer(data, database) {
    let query = `const graphql = require('graphql');${enter}`;
  
  
    if (database === 'MongoDB') {
      for (const prop in data) {
        query += buildDbModelRequirePaths(data[prop]);
      }
    }
    
    if (database === 'MySQL') {
      query += `const getConnection = require('../db/mysql_pool.js');${enter}`;
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
    ${enter}`;
  
    // BUILD TYPE SCHEMA
    for (const prop in data) {
      query += buildGraphqlTypeSchema(data[prop], data, database);
    }
  
    // BUILD ROOT QUERY
    query += `const RootQuery = new GraphQLObjectType({${enter}${tab}name: 'RootQueryType',${enter}${tab}fields: {${enter}`;
  
    let firstRootLoop = true;
    for (const prop in data) {
      if (!firstRootLoop) query += `,${enter}`;
      firstRootLoop = false;
  
      query += buildGraphqlRootQuery(data[prop], database);
    }
    query += `${enter}${tab}}${enter}});${enter}${enter}`;
  
    // BUILD MUTATIONS
    query += `const Mutation = new GraphQLObjectType({${enter}${tab}name: 'Mutation',${enter}${tab}fields: {${enter}`;
  
    let firstMutationLoop = true;
    for (const prop in data) {
      if (!firstMutationLoop) query += `,${enter}`;
      firstMutationLoop = false;
  
      query += buildGraphqlMutationQury(data[prop], database);
    }
    query += `${enter}${tab}}${enter}});${enter}${enter}`;
  
    query += `module.exports = new GraphQLSchema({${enter}${tab}query: RootQuery,${enter}${tab}mutation: Mutation${enter}});`;
    return query;
  }
  
  function buildDbModelRequirePaths(data) {
    return `const ${data.type} = require('../db/${data.type.toLowerCase()}.js');${enter}`;
  }
  
  function buildGraphqlTypeSchema(table, data, database) {
      let query = `const ${table.type}Type = new GraphQLObjectType({${enter}${tab}name: '${table.type}',${enter}${tab}fields: () => ({`;
  
      let firstLoop = true;
      for (let prop in table.fields) {
          if (!firstLoop) query+= ',';
          firstLoop = false;
  
          query += `${enter}${tab}${tab}${table.fields[prop].name}: { type: ${checkForMultipleValues(table.fields[prop].multipleValues, 'front')}`
          query += `${tableTypeToGraphqlType(table.fields[prop].type)}`
          query += `${checkForMultipleValues(table.fields[prop].multipleValues, 'back')} }`;
  
          if (table.fields[prop].relation.tableIndex > -1) {
              query += createSubQuery(table.fields[prop], data, database);
          }
  
          const refBy = table.fields[prop].refBy;
          if (refBy.size > 0) {
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
      return query += `${enter}${tab}})${enter}});${enter}${enter}`;
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
    let query = `,${enter}${tab}${tab}${createSubQueryName(refTypeName)}: {${enter}${tab}${tab}${tab}type: `
    
    if (field.relation.refType === 'one to many' || field.relation.refType === 'many to many') {
        query += `new GraphQLList(${refTypeName}Type),`
    } else {
        query += `${refTypeName}Type,`
    }
    query += `${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}`
    query += `${tab}${tab}${tab}${tab}`
    
    if (database === 'MongoDB') {
      query += `return ${refTypeName}.${findDbSearchMethod(refFieldName, refFieldType, field.relation.refType)}`
      query += `(${createSearchObject(refFieldName, refFieldType, field)});${enter}`
      query += `${tab}${tab}${tab}}${enter}`
      query += `${tab}${tab}}`
    }
  
    if (database === 'MySQL') {
      query += `getConnection((err, con) => {${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}const sql = \`SELECT * FROM ${refTypeName} WHERE `;
  
      if (field.type === 'ID') {
        query += `id = \${parent.${field.name}}`;
      } else {
        query += `${refFieldName} = \${parent.${field.name}}`;
      }
      query += `\`;${enter}${tab}${tab}${tab}${tab}${tab}con.query(sql, (err, result) => {${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}${tab}con.release();${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}${tab}return result;${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}})${enter}`
      query += `${tab}${tab}${tab}${tab}})${enter}`
      query += `${tab}${tab}${tab}}${enter}`
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
    let query = `${tab}${tab}every${toTitleCase(table.type)}: {${enter}`
    query += `${tab}${tab}${tab}type: new GraphQLList(${table.type}Type),${enter}`
    query += `${tab}${tab}${tab}resolve() {${enter}${tab}${tab}${tab}${tab}`
  
    if (database === 'MongoDB') {
      query += `return ${table.type}.find({});`
    }
  
    if (database === 'MySQL') {
      query += `getConnection((err, con) => {${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}const sql = \'SELECT * FROM ${table.type}\';${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}con.query(sql, (err, results) => {${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}${tab}con.release();${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}${tab}return results;${enter}`
      query += `${tab}${tab}${tab}${tab}${tab}})${enter}`
      query += `${tab}${tab}${tab}${tab}})`
    }
  
    return query += `${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;
  }
  
  function createFindByIdQuery(table, database) {
    let query = `,${enter}${tab}${tab}${table.type.toLowerCase()}: {${enter}`
    query += `${tab}${tab}${tab}type: ${table.type}Type,${enter}`
    query += `${tab}${tab}${tab}args: { id: { type: GraphQLID }},${enter}`
    query += `${tab}${tab}${tab}resolve(parent, args) {${enter}`
    query += `${tab}${tab}${tab}${tab}`;
  
    if (database === 'MongoDB') {
      query += `return ${table.type}.findById(args.id);`
    }
  
    if (database === 'MySQL') {
      query += `getConnection((err, con) => {${enter}${tab}${tab}${tab}${tab}${tab}const sql = \`SELECT * FROM ${table.type} WHERE id = \${args.id}\`;${enter}${tab}${tab}${tab}${tab}${tab}con.query(sql, (err, result) => {${enter}${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;${enter}${tab}${tab}${tab}${tab}${tab}${tab}con.release();${enter}${tab}${tab}${tab}${tab}${tab}${tab}return result;${enter}${tab}${tab}${tab}${tab}${tab}})${enter}${tab}${tab}${tab}${tab}})`
    }
  
    return query += `${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;
  }
  
  function buildGraphqlMutationQury(table, database) {
    return `${addMutation(table, database)},${enter}${updateMutation(table, database)},${enter}${deleteMutation(table, database)}` 
  }
  
  function addMutation(table, database) {
    let query = `${tab}${tab}add${table.type}: {${enter}${tab}${tab}${tab}type: ${table.type}Type,${enter}${tab}${tab}${tab}args: {${enter}`;
  
    let firstLoop = true;
    for (const prop in table.fields) {
      if (!firstLoop) query += `,${enter}`;
      firstLoop = false;
  
      query += `${tab}${tab}${tab}${tab}${table.fields[prop].name}: ${buildMutationArgType(table.fields[prop])}`;
    }
  
    query += `${enter}${tab}${tab}${tab}},${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}`
    
    if (database === 'MongoDB') query += `const ${table.type.toLowerCase()} = new ${table.type}(args);${enter}${tab}${tab}${tab}${tab}return ${table.type.toLowerCase()}.save();`;
  
    if (database === 'MySQL') {
      query += `getConnection((err, con) => {${enter}${tab}${tab}${tab}${tab}${tab}const sql = 'INSERT INTO ${table.type} SET ?';${enter}${tab}${tab}${tab}${tab}${tab}con.query(sql, args, (err, result) => {${enter}${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;${enter}${tab}${tab}${tab}${tab}${tab}${tab}con.release();${enter}${tab}${tab}${tab}${tab}${tab}${tab}return result;${enter}${tab}${tab}${tab}${tab}${tab}})${enter}${tab}${tab}${tab}${tab}})`
    }
  
    return query += `${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`
  
    function buildMutationArgType(field) {
      const query = `{ type: ${checkForRequired(field.required, 'front')}${checkForMultipleValues(field.multipleValues, 'front')}${tableTypeToGraphqlType(field.type)}${checkForMultipleValues(field.multipleValues, 'back')}${checkForRequired(field.required, 'back')} }`;
  
      return query;
    }
  }
  
  function updateMutation(table, database) {
    let query = `${tab}${tab}update${table.type}: {${enter}${tab}${tab}${tab}type: ${table.type}Type,${enter}${tab}${tab}${tab}args: {${enter}`;
  
    let firstLoop = true;
    for (const prop in table.fields) {
      if (!firstLoop) query += `,${enter}`;
      firstLoop = false;
  
      query += `${tab}${tab}${tab}${tab}${table.fields[prop].name}: ${buildMutationArgType(table.fields[prop])}`;
    }
  
    query += `${enter}${tab}${tab}${tab}},${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}`
  
    if (database === 'MongoDB') query += `return ${table.type}.findByIdAndUpdate(args.id, args);`;
  
    if (database === 'MySQL') {
      query += `getConnection((err, con) => {${enter}${tab}${tab}${tab}${tab}${tab}let updateValues = '';${enter}${tab}${tab}${tab}${tab}${tab}for (const prop in args) {${enter}${tab}${tab}${tab}${tab}${tab}${tab}updateValues += \`\${prop} = '\${args[prop]}' \`${enter}${tab}${tab}${tab}${tab}${tab}}${enter}${tab}${tab}${tab}${tab}${tab}const sql = \`UPDATE ${table.type} SET \${updateValues}WHERE id = \${args.id}\`;${enter}${tab}${tab}${tab}${tab}${tab}con.query(sql, args, (err, result) => {${enter}${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;${enter}${tab}${tab}${tab}${tab}${tab}${tab}con.release();${enter}${tab}${tab}${tab}${tab}${tab}${tab}return result;${enter}${tab}${tab}${tab}${tab}${tab}})${enter}${tab}${tab}${tab}${tab}})`
    }
  
    return query += `${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;
  
    function buildMutationArgType(field, database) {
      const query = `{ type: ${checkForMultipleValues(field.multipleValues, 'front')}${tableTypeToGraphqlType(field.type)}${checkForMultipleValues(field.multipleValues, 'back')} }`;
  
      return query
    }
  }
  
  function deleteMutation(table, database) {
    let query = `${tab}${tab}delete${table.type}: {${enter}${tab}${tab}${tab}type: ${table.type}Type,${enter}${tab}${tab}${tab}args: { id: { type: GraphQLID }},${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}`
  
    if (database === 'MongoDB') query += `return ${table.type}.findByIdAndRemove(args.id);`
  
    if (database === 'MySQL') {
      query += `getConnection((err, con) => {${enter}${tab}${tab}${tab}${tab}${tab}const sql = \`DELETE FROM ${table.type} WHERE id = \${args.id}\`;${enter}${tab}${tab}${tab}${tab}${tab}con.query(sql, (err, result) => {${enter}${tab}${tab}${tab}${tab}${tab}${tab}if (err) throw err;${enter}${tab}${tab}${tab}${tab}${tab}${tab}con.release();${enter}${tab}${tab}${tab}${tab}${tab}${tab}return result;${enter}${tab}${tab}${tab}${tab}${tab}})${enter}${tab}${tab}${tab}${tab}})`
    }
  
    return query += `${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;
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

  // run parseGraphQLServer to generate code to render to the page
  const code = parseGraphqlServer(props.tables, props.database);

  return (
    <div id="code-container-server">
      <h4 className='codeHeader'>GraphQl Types, Root Queries, and Mutations</h4>
      <hr/>
      <pre>
        {code}
      </pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeServerContainer);
