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

  let serverCode = `const graphql = require('graphql');${enter}`;

  function parseGraphqlMongoServer(data) {
    let query = "const graphql = require('graphql');\n";
  
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
  \n`;
  
    // BUILD TYPE SCHEMA
    for (const prop in data) {
      query += buildGraphqlTypeSchema(data[prop], data);
    }
  
    // BUILD ROOT QUERY
    query += "const RootQuery = new GraphQLObjectType({\n\tname: 'RootQueryType',\n\tfields: {\n";
  
    let firstRootLoop = true;
    for (const prop in data) {
      if (!firstRootLoop) query += ',\n';
      firstRootLoop = false;
  
      query += buildGraphqlRootQury(data[prop]);
    }
    query += '\n\t}\n});\n\n';
  
    // BUILD MUTATIONS
    query += "const Mutation = new GraphQLObjectType({\n\tname: 'Mutation',\n\tfields: {\n";
  
    let firstMutationLoop = true;
    for (const prop in data) {
      if (!firstMutationLoop) query += ',\n';
      firstMutationLoop = false;
  
      query += buildGraphqlMutationQury(data[prop]);
    }
    query += '\n\t}\n});\n\n';
  
    query += 'module.exports = new GraphQLSchema({\n\tquery: RootQuery,\n\tmutation: Mutation\n});';
    return query;
  }
  
  function buildDbModelRequirePaths(data) {
    return `const ${data.type} = require('../db-model/${data.type.toLowerCase()}.js');\n`;
  }
  
  function buildGraphqlTypeSchema(table, data) {
    let query = `const ${table.type}Type = new GraphQLObjectType({\n\tname: '${table.type}',\n\tfields: () => ({`;
  
    let firstLoop = true;
    for (const prop in table.fields) {
      if (!firstLoop) query += ',';
      firstLoop = false;
  
      query += `\n\t\t${table.fields[prop].name}: { type: ${checkForMultipleValues(table.fields[prop].multipleValues, 'front')}${tableTypeToGraphqlType(table.fields[prop].type)}${checkForMultipleValues(table.fields[prop].multipleValues, 'back')} }`;
  
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
  
  function createSubQuery(field, data) {
    const refTypeName = data[field.relation.tableIndex].type;
    const refFieldName = data[field.relation.tableIndex].fields[field.relation.fieldIndex].name;
    const refFieldType = data[field.relation.tableIndex].fields[field.relation.fieldIndex].type;
  
    const query = `,\n\t\t${createSubQueryName(refTypeName)}: {\n\t\t\ttype: ${refTypeName}Type,\n\t\t\tresolve(parent, args) {\n\t\t\t\treturn ${refTypeName}.${findDbSearchMethod(refFieldName, refFieldType, field.relation.refType)}(${createSearchObject(refFieldName, refFieldType, field)});\n\t\t\t}\n\t\t}`;
  
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
    } else {
      return `{ ${refFieldName}: parent.${field.name} }`;
    }
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
    const query = `\t\t${data.type.toLowerCase()}s: {\n\t\t\ttype: new GraphQLList(${data.type}Type),\n\t\t\tresolve() {\n\t\t\t\treturn ${data.type}.find({});\n\t\t\t}\n\t\t}`;
  
    return query;
  }
  
  function createFindByIdQuery(data) {
    const query = `,\n\t\t${data.type.toLowerCase()}: {\n\t\t\ttype: ${data.type}Type,\n\t\t\targs: { id: { type: GraphQLID }},\n\t\t\tresolve(parent, args) {\n\t\t\t\treturn ${data.type}.findById(args.id);\n\t\t\t}\n\t\t}`;
  
    return query;
  }
  
  function buildGraphqlMutationQury(data) {
    let query = `\t\tadd${data.type}: {\n\t\t\ttype: ${data.type}Type,\n\t\t\targs: {\n`;
  
    let firstLoop = true;
    for (const prop in data.fields) {
      if (!firstLoop) query += ',\n';
      firstLoop = false;
  
      query += `\t\t\t\t${data.fields[prop].name}: ${buildMutationArgType(data.fields[prop])}`;
    }
  
    query += `\n\t\t\t},\n\t\t\tresolve(parent, args) {\n\t\t\t\tconst ${data.type.toLowerCase()} = new ${data.type}(args);\n\t\t\t\treturn ${data.type.toLowerCase()}.save();\n\t\t\t}\n\t\t}`;
  
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



  // function parseGraphqlMongoServer(table) {
  //   if (!table) return;

  //   for (const fieldId in table.fields) {
  //     serverCode += buildDbModelRequirePaths(table.fields[fieldId]);
  //   }

  //   serverCode += `
  //  const { 
  //     GraphQLObjectType,
  //     GraphQLSchema,
  //     GraphQLID,
  //     GraphQLString, 
  //     GraphQLInt, 
  //     GraphQLList,
  //     GraphQLNonNull
  //  } = graphql;
  //  ${enter}`;

  //   // BUILD TYPE SCHEMA
  //   for (const fieldId in table.fields) {
  //     serverCode += buildGraphqlTypeSchema(table.fields[fieldId], tables);
  //   }

  //   // BUILD ROOT QUERY
  //   serverCode += `const RootQuery new GraphQLObjectType({${enter}${tab}name: 'RootQueryType',${enter}${tab}fields: {${enter}`;

  //   let firstRootLoop = true;
  //   for (const fieldId in table.fields) {
  //     if (!firstRootLoop) serverCode= `,${enter}`;
  //     firstRootLoop = false;

  //     serverCode += buildGraphqlRootQury(table.fields[fieldId]);
  //   }
  //   serverCode += `${enter}${tab}}${enter}});${enter}${enter}`;

  //   // BUILD MUTATIONS
  //   serverCode= `const Mutation = new GraphQLObjectType({${enter}${tab}name: 'Mutation',${enter}${tab}fields: {${enter}`;

  //   let firstMutationLoop = true;
  //   for (const fieldId in table.fields) {
  //     if (!firstMutationLoop) serverCode= `,${enter}`;
  //     firstMutationLoop = false;

  //     serverCode= buildGraphqlMutationQury(table.fields[fieldId]);
  //   }
  //   serverCode= `${enter}${tab}}${enter}});${enter}${enter}`;

  //   serverCode= `module.exports = new GraphQLSchema({${enter}${tab}query: RootQuery,${enter}${tab}mutation: Mutation${enter}});`;
  //   return query;
  // }

  // function buildDbModelRequirePaths(table) {
  //   return `const ${table.type} = require('../db-model/${table.type.toLowerCase()}.js');${enter}`;
  // }

  // function buildGraphqlTypeSchema(table, data) {
  //   let serverCode `const ${table.type}Type = new GraphQLObjectType({${enter}${tab}name: '${table.type}',${enter}${tab}fields: () => ({`;

  //   let firstLoop = true;
  //   for (const prop in table.fields) {
  //     if (!firstLoop) serverCode= ',';
  //     firstLoop = false;

  //     serverCode= `${enter}${tab}${tab}${table.fields[fieldId].name}: { type: ${checkForMultipleValues(table.fields[fieldId].multipleValues, 'front')}${tableTypeToGraphqlType(table.fields[fieldId].type)}${checkForMultipleValues(table.fields[fieldId].multipleValues, 'back')} }`;

  //     if (table.fields[fieldId].relation.tableIndex > -1) {
  //       serverCode= createSubQuery(table.fields[fieldId], data);
  //     }

  //     const refBy = table.fields[fieldId].refBy;
  //     if (refBy.size) {
  //       refBy.forEach((value) => {
  //         const parsedValue = value.split('.');
  //         const field = {
  //           name: table.fields[fieldId].name,
  //           relation: {
  //             tableIndex: parsedValue[0],
  //             fieldIndex: parsedValue[1],
  //             refType: parsedValue[2],
  //           },
  //         };
  //         serverCode= createSubQuery(field, data);
  //       });
  //     }
  //   }

  //   return serverCode += `${enter}${tab}})${enter}});${enter}${enter}`;
  // }

  // function tableTypeToGraphqlType(type) {
  //   switch (type) {
  //     case 'ID':
  //       return 'GraphQLID';
  //     case 'String':
  //       return 'GraphQLString';
  //     case 'Number':
  //       return 'GraphQLInt';
  //     case 'Boolean':
  //       return 'GraphQLBoolean';
  //     case 'Float':
  //       return 'GraphQLFloat';
  //     default:
  //       return 'GraphQLString';
  //   }
  // }
  
  // function createSubQuery(field, data) {
  //   const refTypeName = data[field.relation.tableIndex].type;
  //   const refFieldName = data[field.relation.tableIndex].fields[field.relation.fieldIndex].name;
  //   const refFieldType = data[field.relation.tableIndex].fields[field.relation.fieldIndex].type;
  
  //   const serverCode ` ,${enter}${tab}${tab}${createSubQueryName(refTypeName)}: {${enter}${tab}${tab}${tab}type: ${refTypeName}Type,${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}return ${refTypeName}.${findDbSearchMethod(refFieldName, refFieldType, field.relation.refType)}(${createSearchObject(refFieldName, refFieldType, field)});${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;
  
  //   return query;
  
  //   function createSubQueryName(tableIndex, data) {
  //     switch (field.relation.refType) {
  //       case 'one to one':
  //         return `${refTypeName.toLowerCase()}`;
  //       case 'one to many':
  //         return `${refTypeName.toLowerCase()}s`;
  //       case 'many to one':
  //         return `${refTypeName.toLowerCase()}`;
  //       case 'many to many':
  //         return `${refTypeName.toLowerCase()}s`;
  //       default:
  //         return `${refTypeName.toLowerCase()}s`;
  //     }
  //   }
  // }
  
  // function findDbSearchMethod(refFieldName, refFieldType, refType) {
  //   if (refFieldName === 'id' || refFieldType === 'ID') return 'findById';
  //   switch (refType) {
  //     case 'one to one':
  //       return 'findOne';
  //     case 'one to many':
  //       return 'find';
  //     case 'many to one':
  //       return 'find';
  //     case 'many to many':
  //       return 'find';
  //     default:
  //       return 'find';
  //   }
  // }
  
  // function createSearchObject(refFieldName, refFieldType, field) {
  //   const refType = field.relation.refType;
  
  //   if (refFieldName === 'id' || refFieldType === 'ID') {
  //     return `parent.${field.name}`;
  //   } if (refType === 'one to one') {
  //     return `{ ${refFieldName}: parent.${field.name} }`;
  //   } else {
  //     return `{ ${refFieldName}: parent.${field.name} }`;
  //   }
  // }
  
  // function buildGraphqlRootQury(data) {
  //   let serverCode '';
  
  //   serverCode= createFindAllRootQuery(data);
  
  //   if (data.fields[0]) {
  //     serverCode= createFindByIdQuery(data);
  //   }
  //   return query;
  // }
  
  // function createFindAllRootQuery(data) {
  //   const serverCode `${tab}${tab}${data.type.toLowerCase()}s: {${enter}${tab}${tab}${tab}type: new GraphQLList(${data.type}Type),${enter}${tab}${tab}${tab}resolve() {${enter}${tab}${tab}${tab}${tab}return ${data.type}.find({});${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;
  
  //   return query;
  // }
  
  // function createFindByIdQuery(data) {
  //   const serverCode `,${enter}${tab}${tab}${data.type.toLowerCase()}: {${enter}${tab}${tab}${tab}type: ${data.type}Type,${enter}${tab}${tab}${tab}args: { id: { type: GraphQLID }},${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}return ${data.type}.findById(args.id);${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;
  
  //   return query;
  // }
  
  // function buildGraphqlMutationQury(table) {
  //   let serverCode `${tab}${tab}add${table.type}: {${enter}${tab}${tab}${tab}type: ${table.type}Type,${enter}${tab}${tab}${tab}args: {${enter}`;
  
  //   let firstLoop = true;
  //   for (const fieldId in table.fields) {
  //     if (!firstLoop) serverCode= ',${enter}';
  //     firstLoop = false;
  
  //     serverCode= `${tab}${tab}${tab}${tab}${data.fields[fieldId].name}: ${buildMutationArgType(data.fields[fieldId])}`;
  //   }
  
  //   serverCode= `${enter}${tab}${tab}${tab}},${enter}${tab}${tab}${tab}resolve(parent, args) {${enter}${tab}${tab}${tab}${tab}const ${table.type.toLowerCase()} = new ${table.type}(args);${enter}${tab}${tab}${tab}${tab}return ${table.type.toLowerCase()}.save();${enter}${tab}${tab}${tab}}${enter}${tab}${tab}}`;
  
  //   return query;
  
  //   function buildMutationArgType(field) {
  //     const serverCode `{ type: ${checkForRequired(field.required, 'front')}${checkForMultipleValues(field.multipleValues, 'front')}${tableTypeToGraphqlType(field.type)}${checkForMultipleValues(field.multipleValues, 'back')}${checkForRequired(field.required, 'back')} }`;
  
  //     return query;
  //   }
  // }
  
  // function checkForRequired(required, position) {
  //   if (required) {
  //     if (position === 'front') {
  //       return 'new GraphQLNonNull(';
  //     } 
  //     return ')';
  //   }
  //   return '';
  // }
  
  // function checkForMultipleValues(multipleValues, position) {
  //   if (multipleValues) {
  //     if (position === 'front') {
  //       return 'new GraphQLList(';
  //     } 
  //     return ')';
  //   }
  //   return '';
  // };
  
  return (
    <div className="code-container-middle">
      <pre>
        {code}
      </pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeServerContainer);
