import React from 'react';
import { connect } from 'react-redux';

// styling
import '../code.css';

const mapStateToProps = store => ({
  tables: store.schema.tables,
});

const CodeClientContainer = (props) => {
  const enter = `
`;
  const tab = '  ';
  let query = `import { gql } from 'apollo-boost';${enter}${enter}`;

  function parseClientQueries(tables) {
    const exportNames = [];

    // Build queries
    for (const tableId in tables) {
      query += buildClientQueryAll(tables[tableId]);
      exportNames.push(`queryEvery${tables[tableId].type}`);

      if (!!tables[tableId].fields[0]) {
        query += buildClientQueryById(tables[tableId]);
        exportNames.push(`query${tables[tableId].type}ById`);
      }
    }
    // Build mutations
    for (const tableId in tables) {
      // Build add mutations
      query += buildMutationParams(tables[tableId], 'add');
      query += buildTypeParams(tables[tableId], 'add');
      query += buildReturnValues(tables[tableId]);
      exportNames.push(`add${tables[tableId].type}Mutation`);

      // Build delete and update mutations if there is an unique id
      if (tables[tableId].fields[0]) {
        // update mutations
        query += buildMutationParams(tables[tableId], 'update');
        query += buildTypeParams(tables[tableId], 'update');
        query += buildReturnValues(tables[tableId]);
        exportNames.push(`update${tables[tableId].type}Mutation`);

        // delete mutations
        query += buildDeleteMutationParams(tables[tableId]);
        query += buildReturnValues(tables[tableId]);
        exportNames.push(`delete${tables[tableId].type}Mutation`);
      }
    }

    let endString = `export {${enter}`;
    exportNames.forEach((name, i) => {
      if (i === 0) {
        endString += `${tab}${name},${enter}`;
      } else if (i < exportNames.length - 1) {
        endString += `${tab}${name},${enter}`;
      } else {
        endString += tab + name + enter;
      }
    });

    return query += `${endString  }};`;
  }
  
  // --------------------- Query Functions ---------------- //

  function buildClientQueryAll(table) {
    let string = `const queryEvery${table.type} = gql\`${enter}`
    string += `${tab}{${enter}`
    string += `${tab}${tab}every${toTitleCase(table.type)} {${enter}`;

    for (const fieldId in table.fields) {
      string += `${tab}${tab}${tab}${table.fields[fieldId].name}${enter}`;
    }
  
    return string += `${tab}${tab}}${enter}${tab}}${enter}\`${enter}${enter}`;
  }
  
  function toTitleCase(refTypeName) {
    let name = refTypeName[0].toUpperCase();
    name += refTypeName.slice(1).toLowerCase();
    return name;
  }

  function buildClientQueryById(table) {
    let string = `const query${table.type}ById = gql\`${enter}`
    string += `${tab}query($${table.type}: ${table.fields[0].type}!) {${enter}`
    string += `${tab}${tab}${table.type}(${table.type}: $${table.type}) {${enter}`;

    for (const fieldId in table.fields) {
      string += `${tab}${tab}${tab}${table.fields[fieldId].name}${enter}`;
    }
  
    return string += `${tab}${tab}}${enter}${tab}}${enter}\`${enter}${enter}`;
  }

  // --------------------- Mutation Functions ---------------- //
  
  // builds params for either add or update mutations
  function buildMutationParams(table, mutationType) {
  let query = `const ${mutationType}${table.type}Mutation = gql\`${enter}${tab}mutation(`;

  let firstLoop = true;
  for (const fieldId in table.fields) {
    // if there's an unique id and creating an update mutation, then take in ID
    if (fieldId === '0' && mutationType === 'update') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `$${table.fields[fieldId].name}: ${table.fields[fieldId].type}!`;
    }
    if (fieldId !== '0') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `$${table.fields[fieldId].name}: ${checkForMultipleValues(table.fields[fieldId].multipleValues, 'front')}`;
      query += `${checkFieldType(table.fields[fieldId].type)}${checkForMultipleValues(table.fields[fieldId].multipleValues, 'back')}`;
      query += `${checkForRequired(table.fields[fieldId].required)}`;
    }
  }
  return query += `) {${enter}${tab}`;
}

// in case the inputed field type is Number, turn to Int to work with GraphQL
function checkFieldType(fieldType) {
  if (fieldType === 'Number') return 'Int'
  else return fieldType
}

function buildDeleteMutationParams(table) {
  const idName = table.fields[0].name;
  let query = `const delete${table.type}Mutation = gpq\`${enter}`
     query += `${tab}mutation($${idName}: ${table.fields[0].type}!){${enter}`
     query += `${tab}${tab}delete${table.type}(${idName}: $${idName}){${enter}`
  return query; 
}

function checkForMultipleValues(multipleValues, position) {
  if (multipleValues) {
    if (position === 'front') {
      return '[';
    }
    return ']';
  }
  return '';
}

function checkForRequired(required) {
  if (required) {
    return '!';
  }
  return '';
}

function buildTypeParams(table, mutationType) {
  let query = `${tab}${mutationType}${table.type}(`;

  let firstLoop = true;
  for (const fieldId in table.fields) {
    // if there's an unique id and creating an update mutation, then take in ID
    if (fieldId === '0' && mutationType === 'update') {
     if (!firstLoop) query += ', ';
     firstLoop = false;
     query += `${table.fields[fieldId].name}: $${table.fields[fieldId].name}`;
    }
    if (fieldId !== '0') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `${table.fields[fieldId].name}: $${table.fields[fieldId].name}`;
    }
  }
  return query += `) {${enter}`;
}

function buildReturnValues(table) {
  let query = '';

  for (const fieldId in table.fields) {
    query += `${tab}${tab}${tab}${table.fields[fieldId].name}${enter}`;
  }

  return query += `${tab}${tab}}${enter}${tab}}${enter}\`${enter}${enter}`;
}


parseClientQueries(props.tables);


  return (
    <div id="code-container-client">
      <h4 className='codeHeader'>Client Queries and Mutations</h4>
      <hr/>
      <pre>
        {query}
      </pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeClientContainer);
