import React, { Component } from 'react';
import { connect } from 'react-redux';

// components
import CodeDBMongoContainer from './code-db-mongo-container.js';
import CodeDBSQLContainer from './code-db-mysql-container.js';
import CodeDBSequelizeContainer from './code-db-sequelize-container.js';
import CodeClientContainer from './code-client-container.js';
import CodeServerContainer from './code-server-container.js';

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
    if (this.props.database === 'Sequelize') databaseContainer = <CodeDBSequelizeContainer/>
  
    return (
      <div className='code-app'>
        <div className='wallpaper'></div>
        {databaseContainer}
        <CodeServerContainer/>
        <CodeClientContainer/>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(CodeApp);
