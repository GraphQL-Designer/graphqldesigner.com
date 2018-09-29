import React from 'react';
import { connect } from 'react-redux';
import './code.css';


const mapStateToProps = store => ({
  // queryName: store.query.queryName,
  // queryField: store.query.graphQLTypeOptions,
  // queryType: store.query.graphQLSearchOptions
  tables: store.schema.tables,
});

const CodeDBSchemaContainer = (props) => {
  const enter = `
  `;
  const tab = '  ';

  let schema = `const mongoose = require('mongoose');${enter}const Schema = mongoose.Schema;`;


  function parseMongoschema(table) {
    if (!table) return;


    let firstLoop = true;
    for (const fieldId in table.fields) {
      if (fieldId !== '0') {
        if (!firstLoop) schema += '`,${enter}${tab}`';
        firstLoop = false;
        schema += createSchemaField(table.fields[fieldId]);
      }
    }
    schema += `${enter}});${enter}${enter}module.exports = mongoose.model("${table.type}",${table.type}Schema);`;

    // if (Object.keys(table).length > 0) {
    // console.log('what is table', tables);
    // }
    return schema;
  }
  function createSchemaField(table) {
    let schema = `${table.name}: ${checkForArray('start')}{${enter}${tab}${tab}type: ${checkDataType(table.type)},${enter}${tab}${tab}unique: ${table.unique},${enter}${tab}${tab}required: ${table.required}`;


    if (table.defaultValue) {
      schema += `,\n\t\tdefault: "${table.defaultValue}"`;
    }

    return schema += `\n\t}${checkForArray('end')}`;

    function checkForArray(position) {
      if (table.multipleValues) {
        if (position === 'start') return '[';
        if (position === 'end') return ']';
      }
      return '';
    }

    function checkDataType(type) {
      if (type === 'ID') {
        return 'String';
      }
      return type;
    }
  }

  parseMongoschema(props.tables[0]);

  return (
    <div className="code-container-side">
      <pre>
        {schema}
      </pre>
    </div>
  );
};
export default connect(mapStateToProps, null)(CodeDBSchemaContainer);
