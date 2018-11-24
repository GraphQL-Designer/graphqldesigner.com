import React from 'react';

// components
import CodeClientContainer from './code-containers/client-code.jsx';
import CodeServerContainer from './code-containers/server-code.jsx';
import DbCodeContainer from './code-containers/db-code.jsx';

const CodeApp = () => (
  <div className="code-app">
    <div className="wallpaper-code" />
    <DbCodeContainer />
    <CodeServerContainer />
    <CodeClientContainer />
  </div>
);


export default CodeApp;
