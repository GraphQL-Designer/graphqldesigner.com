import React from 'react';
import { connect } from 'react-redux';

// Styling
import './code.css';


const mapStateToProps = store => ({
  tables: store.schema.tables,
});

const CodeSqlDBSchemaContainer = (props) => {
  const enter = `
  `;
  const tab = '  ';

  let schemaCode = [];

  function parseSqlSchema(table) {
    if (!table) return;
    let schema = `${tab}const sequelize = require('sequelize');${enter}${enter}`;

    const startLine = `const ${table.type}= sequelize.define("${table.type}", {${enter}${tab}`;
    schema += startLine;
    let firstLoop = true;
    for (const fieldId in table.fields) {
      if (fieldId !== '0') {
        if (!firstLoop) schema += `,${enter}${tab}${tab}`;
        firstLoop = false;
        schema += createSchemaField(table.fields[fieldId]);
      }
    }
    schema += `${enter}});${enter}${enter}module.exports = sequelize.model("${table.type}",${table.type}DataTypes);${enter}${enter}`;

    return schema;
  }
  function createSchemaField(table) {
    let schema = `${table.name}: ${checkForArray('start')}{${enter}${tab}${tab}type: ${checkDataType(table.type)},${enter}${tab}${tab}unique: ${table.unique},${enter}${tab}${tab}required: ${table.required}`;


    if (table.defaultValue) {
      schema += `,${enter}${tab}${tab}default: "${table.defaultValue}"`;
    }

    return schema += `${enter}${tab}${tab}${checkForArray('end')}`;

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
        {parseSqlSchema(props.tables[tableId])};
        <hr/>
      </pre>
    )
  }

  return (
    <div className="code-container-side">
      <h4 className='codeHeader'>Database Schemas</h4>
      <hr/>
      {/* <pre>
        {schema}
      </pre> */}
      {schemaCode}
    </div>
  );
};
export default connect(mapStateToProps, null)(CodeSqlDBSchemaContainer);
