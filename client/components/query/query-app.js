import React from 'react';
import { connect } from 'react-redux';


// components
import QueryCodeContainer from './query-code-container.js';
import CustomizeQueryContainer from './customized-query-container.js'
import CreateQuerySidebar from './sidebar/create-query-sidebar.js';

const mapStateToProps = store => ({
  queryMode: store.query.queryMode,
});

const mapDispatchToProps = dispatch => ({
});

const QueryApp = (props) => {
  let sidebar = '';
  sidebar = <CreateQuerySidebar/>

  return (
    <div id='query-app'>
      <QueryCodeContainer/>
      <CustomizeQueryContainer/>
      {sidebar}
      {/* <img className='wallpaper' src='./images/graphql_wallpaper.png'/> */}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryApp);
