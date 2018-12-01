import React from 'react';
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
  selectedField: store.schema.selectedField,
});

const SchemaApp = ({ tables, selectedField }) => {
  // Dynamically renders each table based on the number of tables.
  function renderTables() {
    return Object.keys(tables).map(tableIndex => (
      <CSSTransition
        key={tableIndex}
        timeout={100}
        classNames="fadeScale"
      >
        <Table
          key={tableIndex}
          tableData={tables[tableIndex]}
          tableIndex={tableIndex}
        />
      </CSSTransition>
    ));
  }

  return (
    <div className="schema-app-container">
      <CSSTransition
        in={true}
        timeout={200}
        classNames="fade"
      >
        <div id="sidebar-container">
          <CSSTransition
            in={selectedField.tableNum < 0}
            key="table"
            timeout={200}
            classNames="fade"
          >
            <CreateTable />
          </CSSTransition>
          <CSSTransition
            in={selectedField.tableNum >= 0}
            key="fields"
            timeout={200}
            classNames="fade"
          >
            <TableOptions />
          </CSSTransition>
        </div>
      </CSSTransition>
      <TransitionGroup className="table-components-container" id="wallpaper-schema">
        {renderTables()}
      </TransitionGroup>
    </div>
  );
}

export default connect(mapStateToProps, null)(SchemaApp);
