import React from 'react';

//components
import Sidebar from './sidebar/sidebar.js';
import Table from './table.js';

//styles
import './schema.css'

const SchemaApp = props => {
  return (
    <div className='schema-app-container'>
      <Sidebar/>
      <Table/>
    </div>
  )
};

export default SchemaApp;