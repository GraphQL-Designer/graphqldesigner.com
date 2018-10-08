import React, { Component } from 'react';
import { connect } from 'react-redux';

// components
import CodeDBMongoContainer from './database-code/code-db-mongo-container.js';
import CodeDBSQLContainer from './database-code/code-db-mysql-container.js';
import CodeDBPostgresSchemaContainer from './database-code/code-db-postgres-container.js';
import CodeClientContainer from './client-code/code-client-container.js';
import CodeServerContainer from './server-code/code-server-container.js';

const mapStateToProps = store => ({
  database: store.schema.database,
});

class CodeApp extends Component {
  constructor (props) {
    super(props)
  }

  render() {
    let databaseContainer = <CodeDBMongoContainer/>
    if (this.props.database === 'MySQL') databaseContainer = <CodeDBSQLContainer/>
    if (this.props.database === 'PostgreSQL') databaseContainer = <CodeDBPostgresSchemaContainer/>
  
    return (
      <div className='code-app'>
        <div className='wallpaper-code'></div>
        {databaseContainer}
        <CodeServerContainer/>
        <CodeClientContainer/>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(CodeApp);
