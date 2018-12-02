import React from 'react';
import { connect } from 'react-redux';

import './query.css';

const mapStateToProps = store => ({
  // tables: store.schema.tables,
  // queries: store.query.queries
});

const CustomizedQueryContainer = (props) => {
  const enter = `
  `;
  const tab = '  ';
  let queryString = '  ';
  let baseSubQueryTabs = tab + tab;

  // accepts all the queries
  function parseClientQueries(queries) {
    const exportNames = [];

    // builds each individual query
    for (let queryId in queries) {
      queryString += buildQuery(queries[queryId]);
      exportNames.push(`query${queries[queryId].name}`);
    }

    let endString = 'export {';
    exportNames.forEach((name, i) => {
      if (i) {
        endString += `, ${name}`;
      } else {
        endString += ` ${name}`;
      }
    });

    return queryString += endString + ' };';
  }

  function buildQuery(query) {
    let string = '';

    // define the starting string for the query
    if (query.fieldIndex === -1) {
      string = `const query${query.name} = gql\`${enter}${tab}{${enter}${tab}${tab}${query.name} {${enter}`;
    } else {
      const searchingByField = props.tables[query.tableIndex].fields[query.fieldIndex];
      string = `const query${query.name} = gql\`${enter}${tab}query($${searchingByField.name}: ${searchingByField.type}) {${enter}${tab}${tab}${query.name}(${searchingByField.name}: $${searchingByField.name}) {${enter}`;
    }

    // display all the base return fields
    for (let fieldIndex in query.returnFields) {
      const fieldName = props.tables[query.tableIndex].fields[fieldIndex].name;
      string += `${tab}${tab}${tab}${fieldName}${enter}`;
    };

    // build SubQueries
    for (let i = 0; i < query.subQueries.length; i += 1) {
      // make sure each subQuery is tabed over one more tab
      baseSubQueryTabs += tab;
      const subQuery = query.subQueries[i];

      // build start of subQuery based on refType
      const subQueryRefType = subQuery.refType;
      if (subQueryRefType === 'one to many' || subQueryRefType === 'many to many') {
        string += `${baseSubQueryTabs}every${props.tables[subQuery.tableIndex].type}{${enter}`;
      } else {
        string += `${baseSubQueryTabs}${props.tables[subQuery.tableIndex].type.toLowerCase()}{${enter}`;
      }

      // build all the return fields of the subQuery
      for (let fieldIndex in subQuery.returnFields) {
        const fieldName = props.tables[subQuery.tableIndex].fields[fieldIndex].name;
        string += baseSubQueryTabs + tab + fieldName + enter;
      }
    }
    // build each SubQuery closing bracket
    for (let k = 0; k < query.subQueries.length; k += 1) {
      string += baseSubQueryTabs + '}' + enter;
      baseSubQueryTabs = baseSubQueryTabs.slice(0, baseSubQueryTabs.length -2);
    }

    return string += `${tab}${tab}}${enter}${tab}}${enter}\`${enter}${enter}`;
  }

  parseClientQueries(props.queries);

  return (
    <div id='customized-query-container'>
      <h4 className='codeHeader'>Customized Query</h4>
      <hr/>
      <pre>{queryString}</pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CustomizedQueryContainer);