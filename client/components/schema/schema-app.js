import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// components
import Table from './table.js';
import CreateTable from './sidebar/create-table.js';
import TableOptions from './sidebar/table-options.js';

// styles
import './schema.css';

// We use store.data, because of index.js reduce function
const mapStateToProps = store => ({
  tables: store.schema.tables,
  tableIndex: store.schema.tableIndex,
  selectedField: store.schema.selectedField,
});

class SchemaApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: true,
    };
  }

  render() {
    // Dynamically renders each table based on the number of tables.
    let tableComponents = [];
    let keyNum = 100; // React requires a key to avoid errors.
    for (let property in this.props.tables){
      tableComponents.push(
        <CSSTransition
        key={property}
        timeout={100}
        classNames="fadeScale"
        >
          <Table
            key={property}
            tableData={this.props.tables[property]}
            tableIndex={property}
            fieldCount={this.props.tables[property].fieldCount}
          />
        </CSSTransition>
      );
    }

    let sidebar = '';
    return (
      <div className='schema-app-container'>
        <CSSTransition
          in={this.state.sidebar}
          timeout={200}
          classNames='fade'
        >
          <div id='sidebar-container'>
            <CSSTransition
              in={this.props.selectedField.tableNum < 0}
              key='table'
              timeout={200}
              classNames='fade'
            >
              <CreateTable/>
            </CSSTransition>

            <CSSTransition
              in={this.props.selectedField.tableNum >= 0}
              key='fields'
              timeout={200}
              classNames='fade'
            >
              <TableOptions/>
            </CSSTransition>
          </div>
        </CSSTransition>
        <TransitionGroup className='table-components-container'>
          <img className='wallpaper' src='./images/graphql_wallpaper.png'/>
          {tableComponents}
        </TransitionGroup>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(SchemaApp);
