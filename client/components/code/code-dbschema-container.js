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

  let schema = `${tab}const mongoose = require('mongoose');${enter}const Schema = mongoose.Schema;${enter}${enter}`;


  function parseMongoschema(table) {
    if (!table) return;

    const startLine = `const ${table.type.toLowerCase()}Schema = new Schema({${enter}${tab}${tab}${tab}`;
    schema += startLine;
    let firstLoop = true;
    for (const fieldId in table.fields) {
      if (fieldId !== '0') {
        if (!firstLoop) schema += `,${enter}${tab}${tab}${tab}`;
        firstLoop = false;
        schema += createSchemaField(table.fields[fieldId]);
      }
    }
    schema += `${enter}});${enter}${enter}module.exports = mongoose.model("${table.type}",${table.type}Schema);${enter}${enter}`;

    // if (Object.keys(table).length > 0) {
    // console.log('what is table', tables);
    // }
    return schema;
  }
  function createSchemaField(table) {
    let schema = `${table.name}: ${checkForArray('start')}{${enter}${tab}${tab}${tab}${tab}${tab}type: ${checkDataType(table.type)},${enter}${tab}${tab}${tab}${tab}${tab}unique: ${table.unique},${enter}${tab}${tab}${tab}${tab}${tab}required: ${table.required}`;


    if (table.defaultValue) {
      schema += `,${enter}${tab}${tab}${tab}${tab}${tab}default: "${table.defaultValue}"`;
    }

    return schema += `${enter}${tab}${tab}${tab}}${checkForArray('end')}`;

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
  for (const tableId in props.tables) {
    parseMongoschema(props.tables[tableId]);
  }
  const schemas = [];
  // for (let schema in props.tables[tableId]){
  // schemas.push(
  return (
    <div className="code-container-side">
      <pre>
        {schema}
      </pre>
    </div>
  );
};
export default connect(mapStateToProps, null)(CodeDBSchemaContainer);
