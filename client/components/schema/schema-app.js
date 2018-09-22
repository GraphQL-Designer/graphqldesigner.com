import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

//components
import Table from './table.js';
import CreateTable from './sidebar/create-table.js'
import TableOptions from './sidebar/table-options.js'

//styles
import './schema.css'

// We use store.data, because of index.js reduce function
const mapStateToProps = store => ({
  tables: store.data.tables, 
  tableIndex: store.data.tableIndex,
  // Need below to subscribe to store. store.data.tables is an object so never changes
  tableCount: store.data.tableCount,
  selectedField: store.data.selectedField
});

class SchemaApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebar: true
    }
  }

  render() {
    // Dynamically renders each table based on the number of tables. 
    let tableComponents = []; 
    let keyNum = 100 //React requires a key to avoid errors. 
    for (let property in this.props.tables){
      tableComponents.push(<Table
        key={property} 
        tableData={this.props.tables[property]}
        tableIndex={property}
        fieldCount={this.props.tables[property].fieldCount}
        />
      )
    }
    
    let sidebar = '';
    return (
      <div className='schema-app-container'>
        <CSSTransition
          in={this.state.sidebar}
          appear={true}
          timeout={350}
          classNames='fade'
        >
          <div id='sidebar-container'>
            <CSSTransition
              in={this.props.selectedField.tableNum < 0}
              key='table'
              appear={true}
              timeout={350}
              classNames='fade'
            >
              <CreateTable/>
            </CSSTransition>
            
            <CSSTransition
              in={this.props.selectedField.tableNum >= 0}
              key='fields'
              appear={true}
              timeout={350}
              classNames='fade'
            >
              <TableOptions/> 
            </CSSTransition>
          </div>
            {/* {this.props.selectedField < 0 ? <CreateTable/> : <TableOptions/>} */}
        </CSSTransition>
        <div className='table-components-container'>
          {tableComponents}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(SchemaApp);