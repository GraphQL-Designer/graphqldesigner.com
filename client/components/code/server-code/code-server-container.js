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

  function parseGraphQLServer(tables, database) {
    let query = `const graphql = require('graphql');${enter}`;

    // if (database === 'MongoDB') {
      for (const tableId in tables) {
        query += buildMongoRequirePaths(tables[tableId]);
      }
    // }
    // if (database === 'MySQL') {
    //   // COMPLETE, DON'T KNOW PATH
    //   query += `const db = require('')`
    // }

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
    for (const tableId in tables) {
      query += buildGraphqlTypeSchema(tables[tableId], tables);
    }

    // BUILD ROOT QUERY
    query += `const RootQuery = new GraphQLObjectType({${enter}${tab}name: 'RootQueryType',${enter}${tab}fields: {${enter}`;

    let firstRootLoop = true;
    for (const tableId in tables) {
      if (!firstRootLoop) query += `,${enter}`;
      firstRootLoop = false;

      query += buildGraphqlRootQury(tables[tableId]);
    }
    query += `${enter}${tab}}${enter}});${enter}${enter}`;

    // BUILD MUTATIONS
    query += `const Mutation = new GraphQLObjectType({${enter}${tab}name: 'Mutation',${enter}${tab}fields: {${enter}`;

    let firstMutationLoop = true;
    for (const tableId in tables) {
      if (!firstMutationLoop) query += `,${enter}`;
      firstMutationLoop = false;

      query += buildGraphqlMutationQury(tables[tableId]);
    }
    query += `${enter}${tab}}${enter}});${enter}${enter}`;

    query += `module.exports = new GraphQLSchema({${enter}${tab}query: RootQuery,${enter}${tab}mutation: Mutation${enter}});`;
    return query;
  }

  function buildMongoRequirePaths(table) {
    // UPDATE
    return `const ${table.type} = require('../db-model/${table.type.toLowerCase()}.js');${enter}`;
  }

  function buildGraphqlTypeSchema(table, tables) {
    let query = `const ${table.type}Type = new GraphQLObjectType({${enter}${tab}name: '${table.type}',${enter}${tab}fields: () => ({`;

    let firstLoop = true;
    for (const prop in table.fields) {
      if (!firstLoop) query += ',';
      firstLoop = false;

      query += `${enter}${tab}${tab}${table.fields[prop].name}: { type: ${checkForMultipleValues(table.fields[prop].multipleValues, 'front')}${tableTypeToGraphqlType(table.fields[prop].type)}${checkForMultipleValues(table.fields[prop].multipleValues, 'back')} }`;

      if (table.fields[prop].relation.tableIndex > -1) {
        query += createSubQuery(table.fields[prop], tables);
      }

      const refBy = table.fields[prop].refBy;
      if (refBy.size) {
        refBy.forEach((value) => {
          const parsedValue = value.split('.');
          const field = {
            name: table.fields[prop].name,
            relation: {
              tableIndex: parsedValue[0],
              fieldIndex: parsedValue[1],
              refType: parsedValue[2],
            },
          };
          query += createSubQuery(field, tables);
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
    let name = refTypeName[0].toUpperCase()
    name += refTypeName.slice(1).toLowerCase()
    return name
  }

  function createSubQuery(field, tables) {
    const refTypeName = tables[field.relation.tableIndex].type;
    const refFieldName = tables[field.relation.tableIndex].fields[field.relation.fieldIndex].name;
    const refFieldType = tables[field.relation.tableIndex].fields[field.relation.fieldIndex].type;

    let query = `,${enter}${tab}${tab}${createSubQueryName()}: {${enter}`
        query += `${tab}${tab}${tab}type: ${refTypeName}Type,${enter}`
        query += `${tab}${tab}${tab}resolve(parent, args) {${enter}`
        query += `${tab}${tab}${tab}${tab}`

        if (props.database === 'MongoDB') {
          query += `return ${refTypeName}.${findMongooseSearchMethod(refFieldName, refFieldType, field.relation.refType)}`
          query += `(${createSearchObject(refFieldName, refFieldType, field)});${enter}`
        } else if (props.database === 'MySQL') {
          query += `db.query("SELECT * FROM ${refTypeName} WHERE ${refFieldName} = )`
        }
        query += `${tab}${tab}${tab}}${enter}${tab}${tab}}`;
    return query;

    function createSubQueryName() {
      switch (field.relation.refType) {
        case 'one to one':
          return `related${toTitleCase(refTypeName)}`
        case 'one to many':
          return `everyRelated${toTitleCase(refTypeName)}`
        case 'many to one':
          return `related${toTitleCase(refTypeName)}`
        case 'many to many':
          return `everyRelated${toTitleCase(refTypeName)}`
        default:
          return `everyRelated${toTitleCase(refTypeName)}`
        }
    }
  }

  function findMongooseSearchMethod(refFieldName, refFieldType, refType) {
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
    } 
    return `{ ${refFieldName}: parent.${field.name} }`;
  }

  function buildGraphqlRootQury(table) {
    let query = '';

    query += createFindAllRootQuery(table);

    if (table.fields[0]) {
      query += createFindByIdQuery(table);
    }
    return query;
  }

  function createFindAllRootQuery(table) {
    const query = `${tab}${tab}every${toTitleCase(table.type)}: {${enter}${tab}${tab}${tab}type: new GraphQLList(${table.type}Type),${enter}${tab}${tab}${tab}resolve() {${enter}${tab}${tab}${tab}${tab}return ${table.type}.find({});${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;

    return query;
  }

  function createFindByIdQuery(table) {
    const query = `,${enter}${tab}${tab}${table.type.toLowerCase()}: {${enter}${tab}${tab}${tab}type: ${table.type}Type,${enter}${tab}${tab}${tab}args: { id: { type: GraphQLID }},${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}return ${table.type}.findById(args.id);${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;

    return query;
  }

  function buildGraphqlMutationQury(table) {
    let query = `${tab}${tab}add${table.type}: {${enter}${tab}${tab}${tab}type: ${table.type}Type,${enter}${tab}${tab}${tab}args: {${enter}`;

    let firstLoop = true;
    for (const prop in table.fields) {
      if (!firstLoop) query += `,${enter}`;
      firstLoop = false;

      query += `${tab}${tab}${tab}${tab}${table.fields[prop].name}: ${buildMutationArgType(table.fields[prop])}`;
    }

    query += `${enter}${tab}${tab}${tab}},${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}const ${table.type.toLowerCase()} = new ${table.type}(args);${enter}${tab}${tab}${tab}${tab}return ${table.type.toLowerCase()}.save();${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;

    return query;

    function buildMutationArgType(field) {
      const query = `{ type: ${checkForRequired(field.required, 'front')}${checkForMultipleValues(field.multipleValues, 'front')}${tableTypeToGraphqlType(field.type)}${checkForMultipleValues(field.multipleValues, 'back')}${checkForRequired(field.required, 'back')} }`;

      return query;
    }
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

  const code = parseGraphQLServer(props.tables, props.database);

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
