import React from 'react';
import TableDetails from './table-details.js'

const SchemaSidebar = props => {
  return (
    <div className = "schema-sidebar-container">
      <h4>Create Table</h4>
      <input placeholder='Table Name'></input>
      <TableDetails/>
    </div>
  )
};

export default SchemaSidebar;