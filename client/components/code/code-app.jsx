import React from 'react';

// components
import CodeClientContainer from './code-containers/client-code';
import CodeServerContainer from './code-containers/server-code';
import DbCodeContainer from './code-containers/db-code';

const CodeApp = () => (
  <div className="code-app">
    <div className="wallpaper-code" />
    <DbCodeContainer />
    <CodeServerContainer />
    <CodeClientContainer />
  </div>
);


export default CodeApp;
