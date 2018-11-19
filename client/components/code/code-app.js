import React from 'react';

// components
import CodeClientContainer from './code-containers/client-code.js';
import CodeServerContainer from './code-containers/server-code.js';
import DbCodeContainer from './code-containers/db-code.js'

const CodeApp = props => {
    return (
      <div className='code-app'>
        <div className='wallpaper-code'></div>
        <DbCodeContainer/>
        <CodeServerContainer/>
        <CodeClientContainer/>
      </div>
    )
}

export default CodeApp;
