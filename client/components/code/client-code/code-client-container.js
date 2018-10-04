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

    // tables is state.tables from schemaReducer
    for (const tableId in tables) {
      query += buildClientQueryAll(tables[tableId]);
      exportNames.push(`queryEvery${tables[tableId].type}`);

      if (!!tables[tableId].fields[0]) {
        query += buildClientQueryById(tables[tableId]);
        exportNames.push(`query${tables[tableId].type}ById`);
      }
    }

    let endString = 'export {';
    exportNames.forEach((name, i) => {
      if (i === 0) {
        endString += `${name},${enter}`;
      } else if (i < exportNames.length - 1) {
        endString += `${tab}${name},${enter}`;
      } else {
        endString += tab + name + enter;
      }
    });

    return query += `${endString  }};`;
  }

  function buildClientQueryAll(table) {
    let string = `const queryEvery${table.type} = gql\`${enter}${tab}{${enter}${tab}${tab}${table.type.toLowerCase()}s {${enter}`;

    for (const fieldId in table.fields) {
      string += `${tab}${tab}${tab}${table.fields[fieldId].name}${enter}`;
    }
  
    return string += `${tab}${tab}}${enter}${tab}}${enter}\`${enter}${enter}`;
  }

  function buildClientQueryById(tables) {
    let string = `const query${tables.type}ById = gql\`${enter}${tab}query($id: ID) {${enter}${tab}${tab}${tables.type.toLowerCase()}(id: $id) {${enter}`;

    for (const prop in tables.fields) {
      string += `${tab}${tab}${tab}${tables.fields[prop].name}${enter}`;
    }
  
    return string += `${tab}${tab}}${enter}${tab}}${enter}\`${enter}${enter}`;
  }

  parseClientQueries(props.tables);

  return (
    <div id="code-container-client">
      <h4 className='codeHeader'>Client Queries</h4>
      <hr/>
      <pre>
        {query}
      </pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeClientContainer);
