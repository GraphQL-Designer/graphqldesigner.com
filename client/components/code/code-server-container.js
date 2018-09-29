import React from 'react';
import { connect } from 'react-redux';
import './code.css';

const mapStateToProps = store => ({

  tables: store.schema.tables,
});

const CodeServerContainer = (props) => {
  const enter = `
  `;
  const tab = '  ';

  function parseGraphqlMongoServer(data) {
    let query = `${tab}const graphql = require('graphql');${enter}`;

    for (const prop in data) {
      query += buildDbModelRequirePaths(data[prop]);
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
      query += buildGraphqlTypeSchema(data[prop], data);
    }

    // BUILD ROOT QUERY
    query += `const RootQuery = new GraphQLObjectType({${enter}${tab}name: 'RootQueryType',${enter}${tab}fields: {${enter}`;

    let firstRootLoop = true;
    for (const prop in data) {
      if (!firstRootLoop) query += `,${enter}`;
      firstRootLoop = false;

      query += buildGraphqlRootQury(data[prop]);
    }
    query += `${enter}${tab}}${enter}});${enter}${enter}`;

    // BUILD MUTATIONS
    query += `const Mutation = new GraphQLObjectType({${enter}${tab}name: 'Mutation',${enter}${tab}fields: {${enter}`;

    let firstMutationLoop = true;
    for (const prop in data) {
      if (!firstMutationLoop) query += `,${enter}`;
      firstMutationLoop = false;

      query += buildGraphqlMutationQury(data[prop]);
    }
    query += `${enter}${tab}}${enter}});${enter}${enter}`;

    query += `module.exports = new GraphQLSchema({${enter}${tab}query: RootQuery,${enter}${tab}mutation: Mutation${enter}});`;
    return query;
  }

  function buildDbModelRequirePaths(data) {
    return `const ${data.type} = require('../db-model/${data.type.toLowerCase()}.js');${enter}`;
  }

  function buildGraphqlTypeSchema(table, data) {
    let query = `const ${table.type}Type = new GraphQLObjectType({${enter}${tab}name: '${table.type}',${enter}${tab}fields: () => ({`;

    let firstLoop = true;
    for (const prop in table.fields) {
      if (!firstLoop) query += ',';
      firstLoop = false;

      query += `${enter}${tab}${tab}${table.fields[prop].name}: { type: ${checkForMultipleValues(table.fields[prop].multipleValues, 'front')}${tableTypeToGraphqlType(table.fields[prop].type)}${checkForMultipleValues(table.fields[prop].multipleValues, 'back')} }`;

      if (table.fields[prop].relation.tableIndex > -1) {
        query += createSubQuery(table.fields[prop], data);
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
          query += createSubQuery(field, data);
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

  function createSubQuery(field, data) {
    const refTypeName = data[field.relation.tableIndex].type;
    const refFieldName = data[field.relation.tableIndex].fields[field.relation.fieldIndex].name;
    const refFieldType = data[field.relation.tableIndex].fields[field.relation.fieldIndex].type;

    const query = `,${enter}${tab}${tab}${createSubQueryName(refTypeName)}: {${enter}${tab}${tab}${tab}type: ${refTypeName}Type,${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}return ${refTypeName}.${findDbSearchMethod(refFieldName, refFieldType, field.relation.refType)}(${createSearchObject(refFieldName, refFieldType, field)});${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;

    return query;

    function createSubQueryName(tableIndex, data) {
      switch (field.relation.refType) {
        case 'one to one':
          return `${refTypeName.toLowerCase()}`;
        case 'one to many':
          return `${refTypeName.toLowerCase()}s`;
        case 'many to one':
          return `${refTypeName.toLowerCase()}`;
        case 'many to many':
          return `${refTypeName.toLowerCase()}s`;
        default:
          return `${refTypeName.toLowerCase()}s`;
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
    } if (refType === 'one to one') {
      return `{ ${refFieldName}: parent.${field.name} }`;
    }
    return `{ ${refFieldName}: parent.${field.name} }`;
  }

  function buildGraphqlRootQury(data) {
    let query = '';

    query += createFindAllRootQuery(data);

    if (data.fields[0]) {
      query += createFindByIdQuery(data);
    }
    return query;
  }

  function createFindAllRootQuery(data) {
    const query = `${tab}${tab}${data.type.toLowerCase()}s: {${enter}${tab}${tab}${tab}type: new GraphQLList(${data.type}Type),${enter}${tab}${tab}${tab}resolve() {${enter}${tab}${tab}${tab}${tab}return ${data.type}.find({});${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;

    return query;
  }

  function createFindByIdQuery(data) {
    const query = `,${enter}${tab}${tab}${data.type.toLowerCase()}: {${enter}${tab}${tab}${tab}type: ${data.type}Type,${enter}${tab}${tab}${tab}args: { id: { type: GraphQLID }},${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}return ${data.type}.findById(args.id);${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;

    return query;
  }

  function buildGraphqlMutationQury(data) {
    let query = `${tab}${tab}add${data.type}: {${enter}${tab}${tab}${tab}type: ${data.type}Type,${enter}${tab}${tab}${tab}args: {${enter}`;

    let firstLoop = true;
    for (const prop in data.fields) {
      if (!firstLoop) query += `,${enter}`;
      firstLoop = false;

      query += `${tab}${tab}${tab}${tab}${data.fields[prop].name}: ${buildMutationArgType(data.fields[prop])}`;
    }

    query += `${enter}${tab}${tab}${tab}},${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}const ${data.type.toLowerCase()} = new ${data.type}(args);${enter}${tab}${tab}${tab}${tab}return ${data.type.toLowerCase()}.save();${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;

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

  const code = parseGraphqlMongoServer(props.tables);

  return (
    <div className="code-container-middle">
      <pre>
        {code}
      </pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeServerContainer);
