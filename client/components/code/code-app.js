import React, { Component } from 'react';

// components
import CodeDBMongoContainer from './code-db-mongo-container.js';
import CodeDBSQLContainer from './code-db-sql-container.js';
import CodeDBSequelizeContainer from './code-db-sequelize-container.js';
import CodeClientContainer from './code-client-container.js';
import CodeServerContainer from './code-server-container.js';

class CodeApp extends Component {
  constructor (props) {
    super(props)
  }

  render() {
  
    return (
      <div className='code-app'>
        <div className='wallpaper'></div>
        {/* <CodeDBMongoContainer/> */}
        {/*<CodeSqlDBSequelizeContainer/>*/}
        <CodeDBSQLContainer/>
        <CodeServerContainer/>
        <CodeClientContainer/>
      </div>
    )
  }
}

export default CodeApp;
