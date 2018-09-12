import React from 'react';

//components
import SchemaSidebar from './schema-sidebar.js';
import Table from './table.js';

//styles
import './schema.css'

const SchemaApp = props => {
  return (
    <div className='schema-app-container'>
      <h4>Schema App</h4>
      <SchemaSidebar/>
      <Table/>
    </div>
  )
};

export default SchemaApp;