import React from 'react';

//components
import Sidebar from './sidebar/create-query-sidebar.js';
import QueryCodeContainer from './query-code-container.js'

const QueryApp = props => {
  return (
    <div className='query-app'>
      <QueryCodeContainer/>
      <Sidebar/>
    </div>
  )
};

export default QueryApp;