import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// components
import Table from './table.jsx';
import CreateTable from './sidebar/create-table.jsx';
import TableOptions from './sidebar/table-options.jsx';

// styles
import './schema.css';

// We use store.data, because of index.js reduce function
const mapStateToProps = store => ({
  tables: store.schema.tables,
  tableIndex: store.schema.tableIndex,
  selectedField: store.schema.selectedField,
});

const SchemaApp = props => {
  // Dynamically renders each table based on the number of tables.
  const tableComponents = [];
  Object.keys(props.tables).forEach(tableIndex => (
    tableComponents.push(
      <CSSTransition
        key={tableIndex}
        timeout={100}
        classNames="fadeScale"
      >
        <Table
          key={tableIndex}
          tableData={props.tables[tableIndex]}
          tableIndex={tableIndex}
          fieldCount={props.tables[tableIndex].fieldCount}
        />
      </CSSTransition>,
    )
  ));
  return (
    <div className="schema-app-container">
      <CSSTransition
        in={true}
        timeout={200}
        classNames="fade"
      >
        <div id="sidebar-container">
          <CSSTransition
            in={props.selectedField.tableNum < 0}
            key="table"
            timeout={200}
            classNames="fade"
          >
            <CreateTable/>
          </CSSTransition>
          <CSSTransition
            in={props.selectedField.tableNum >= 0}
            key="fields"
            timeout={200}
            classNames="fade"
          >
            <TableOptions/>
          </CSSTransition>
        </div>
      </CSSTransition>
      <TransitionGroup className="table-components-container" id="wallpaper-schema">
        {tableComponents}
      </TransitionGroup>
    </div>
  );
}

export default connect(mapStateToProps, null)(SchemaApp);
