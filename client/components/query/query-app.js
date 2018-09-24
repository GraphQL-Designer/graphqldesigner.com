import React from 'react';
import { connect } from 'react-redux';


//components
import CreateQuerySidebar from './sidebar/create-query-sidebar.js';
import CustomizeQuerySidebar from './sidebar/customize-query-sidebar.js';
import QueryCodeContainer from './query-code-container.js'

const mapStateToProps = store => ({
  queryMode: store.query.queryMode
});

const mapDispatchToProps = dispatch => ({
  //deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
});

const QueryApp = props => {
  let sidebar = ''; 
  if (props.queryMode === 'create') {
    sidebar = <CreateQuerySidebar/>
  } else {
    sidebar = <CustomizeQuerySidebar/>
  }

  return (
    <div className='query-app'>
      <QueryCodeContainer/>
      {sidebar}
    </div>
  )
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryApp);

