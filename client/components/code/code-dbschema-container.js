import React from 'react';
import { connect } from 'react-redux';

// Styling
import './code.css';


const mapStateToProps = store => ({
  tables: store.schema.tables,
});

const CodeDBSchemaContainer = (props) => {
  const enter = `
  `;
  const tab = '  ';

  let schemaCode = [];

  function parseMongoschema(table) {
    if (!table) return;
    let schema = `${tab}const mongoose = require('mongoose');${enter}const Schema = mongoose.Schema;${enter}${enter}`;

    const startLine = `const ${table.type.toLowerCase()}Schema = new Schema({${enter}${tab}`;
    schema += startLine;
    let firstLoop = true;
    for (const fieldId in table.fields) {
      if (fieldId !== '0') {
        if (!firstLoop) schema += `,${enter}${tab}${tab}`;
        firstLoop = false;
        schema += createSchemaField(table.fields[fieldId]);
      }
    }
    schema += `${enter}});${enter}${enter}module.exports = mongoose.model("${table.type}",${table.type}Schema)`;

    return schema;
  }
  function createSchemaField(table) {
    let schema = `${table.name}: ${checkForArray('start')}{${enter}${tab}${tab}type: ${checkDataType(table.type)},${enter}${tab}${tab}unique: ${table.unique},${enter}${tab}${tab}required: ${table.required}`;


    if (table.defaultValue) {
      schema += `,${enter}${tab}${tab}default: "${table.defaultValue}"`;
    }

    return schema += `${enter}${tab}}${checkForArray('end')}`;

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
    schemaCode.push(
      <pre>
        {parseMongoschema(props.tables[tableId])};
        <hr/>
      </pre>
    )
  }

  return (
    <div id="code-container-database">
      <h4 className='codeHeader'>Database Schemas</h4>
      <hr/>
      {schemaCode}
      <pre id='column-filler-for-scroll'></pre>
    </div>
  );
};
export default connect(mapStateToProps, null)(CodeDBSchemaContainer);
