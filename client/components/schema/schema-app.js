import React from 'react';
import { connect } from 'react-redux';

//components
import Sidebar from './sidebar/sidebar.js';
import Table from './table.js';

//styles
import './schema.css'

//we use store.data, because of index.js reduce function
const mapStateToProps = store => ({
  tables: store.data.tables, 
  //need below to subscribe to store. store.data.tables is an object so never changes
  tableIndex: store.data.tableIndex 
});

const SchemaApp = props => {
  let tableComponents = []; 
  for (let i = 0; i < Object.keys(props.tables).length; i += 1){
    tableComponents.push(<Table key={i} tableData={props.tables[i]}/>)
  }

  return (
    <div className='schema-app-container'>
      <Sidebar/>
      {/* <Table/> */}
      {tableComponents}
    </div>
  )
};

export default connect(mapStateToProps, null)(SchemaApp);