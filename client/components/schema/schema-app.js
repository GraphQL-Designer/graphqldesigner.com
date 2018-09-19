import React from 'react';
import { connect } from 'react-redux';

//components
import Sidebar from './sidebar/sidebar.js';
import Table from './table.js';
import CreateTable from './sidebar/create-table.js'

//styles
import './schema.css'

// We use store.data, because of index.js reduce function
const mapStateToProps = store => ({
  tables: store.data.tables, 
  tableIndex: store.data.tableIndex,
  // Need below to subscribe to store. store.data.tables is an object so never changes
  tableCount: store.data.tableCount,
  createTableState: store.data.createTableState
});

const SchemaApp = props => {

  // Dynamically renders each table based on the number of tables. 
  let tableComponents = []; 
  let keyNum = 100 //React requires a key to avoid errors. 
  for (let property in props.tables){
    tableComponents.push(<Table
      key = {keyNum++} 
      tableData={props.tables[property]}
      tableIndex={property}
      fieldCount={props.tables[property].fieldCount}
      />
    )
  }

  let sidebar = '';
  if (props.createTableState) sidebar = <CreateTable/>

  return (
    <div className='schema-app-container'>
      <div id='sidebar-container'>
        {sidebar}
      </div>
      <div className='table-components-container'>
        {tableComponents}
      </div>
    </div>
  )
};

export default connect(mapStateToProps, null)(SchemaApp);