import React from 'react';
import './query.css';
import { connect } from 'react-redux';
import CreateQuerySidebar from './sidebar/create-query-sidebar.jsx';

const mapStateToProps = store => ({
  // tables: store.schema.tables,
});

const QueryCodeContainer = (props) => {
  const enter = `
  `;
  const tab = '  ';
  let query = `${tab}import { gql } from 'apollo-boost';${enter}${enter}`;

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
    <div id="query-code-container">
      <h4 className='codeHeader'>Built Queries</h4>
      <hr/>
      <pre>
        {query}
      </pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(QueryCodeContainer);
