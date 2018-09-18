import React from 'react';

//components
// import Sidebar from './sidebar/create-query-sidebar.js';
// import QueryCodeContainer from './query-code-container.js'
import CodeDBSchemaContainer from './code-dbschema-container.js';
import CodeClientContainer from './code-client-container.js';
import CodeServerContainer from './code-server-container.js';

const CodeApp = props => {
  return (
    <div className='code-app'>
      <CodeDBSchemaContainer/>
      <CodeClientContainer/>
      <CodeServerContainer/>
    </div>
  )
};

export default CodeApp;