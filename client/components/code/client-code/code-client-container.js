import React from 'react';
import { connect } from 'react-redux';

// styling
import '../code.css';

const mapStateToProps = store => ({
  // queryName: store.query.queryName,
  // queryField: store.query.graphQLTypeOptions,
  // queryType: store.query.graphQLSearchOptions
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
      query += buildAddMutationParams(tables[tableId], 'add');
      query += buildTypeParamas(tables[tableId]);
      query += buildReturnValues(tables[tableId]);
      exportNames.push(`add${tables[tableId].type}Mutation`);

      // Build delete mutations if there is an unique id
      if (tables[tableId].fields[0]) {
        query += buildDeleteMutationParams(tables[tableId]);
        query += buildReturnValues(tables[tableId]);
        exportNames.push(`remove${tables[tableId].type}Mutation`);
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
    let string = `const queryEvery${table.type} = gql\`${enter}${tab}{${enter}${tab}${tab}${table.type.toLowerCase()}s {${enter}`;

    for (const fieldId in table.fields) {
      string += `${tab}${tab}${tab}${table.fields[fieldId].name}${enter}`;
    }
  
    return string += `${tab}${tab}}${enter}${tab}}${enter}\`${enter}${enter}`;
  }

  function buildClientQueryById(tables) {
    let string = `const query${tables.type}ById = gql\`${enter}${tab}query($id: ID) {${enter}${tab}${tab}${tables.type.toLowerCase()}(id: $id) {${enter}`;

    for (const fieldId in tables.fields) {
      string += `${tab}${tab}${tab}${tables.fields[fieldId].name}${enter}`;
    }
  
    return string += `${tab}${tab}}${enter}${tab}}${enter}\`${enter}${enter}`;
  }

  // --------------------- Mutation Functions ---------------- //
  
  function buildAddMutationParams(table, mutationType) {
  let query = `const add${table.type}Mutation = gql\`${enter}${tab}mutation(`;

  let firstLoop = true;
  for (const fieldId in table.fields) {
    if (fieldId !== '0') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `$${table.fields[fieldId].name}: ${checkForMultipleValues(table.fields[fieldId].multipleValues, 'front')}`;
      query += `${table.fields[fieldId].type}${checkForMultipleValues(table.fields[fieldId].multipleValues, 'back')}`;
      query += `${checkForRequired(table.fields[fieldId].required)}`;
    }
  }
  return query += `) {${enter}${tab}`;
}

function buildDeleteMutationParams(table) {
  let query = `const delete${table.type}Mutation = gpq\`${enter}`
     query += `${tab}mutation($id: ID){${enter}`
     query += `${tab}${tab}delete${table.type}(id: $id){${enter}`
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

function buildTypeParamas(table) {
  let query = `${tab}addBook(`;

  let firstLoop = true;
  for (const fieldId in table.fields) {
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
