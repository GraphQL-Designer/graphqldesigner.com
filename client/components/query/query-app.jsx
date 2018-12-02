import React from 'react';
import { connect } from 'react-redux';


// components
import QueryCodeContainer from './query-code-container.jsx';
import CustomizeQueryContainer from './customized-query-container.jsx'
import CreateQuerySidebar from './sidebar/create-query-sidebar.jsx';

const mapStateToProps = store => ({
  // queryMode: store.query.queryMode,
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
