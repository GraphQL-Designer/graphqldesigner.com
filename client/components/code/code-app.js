import React, { Component } from 'react';
import { connect } from 'react-redux';

// components
import CodeClientContainer from './client-code/code-client-container.js';
import CodeServerContainer from './server-code/code-server-container.js';
import DbCodeContainer from './database-code/code-db-container.js'

const mapStateToProps = store => ({
  database: store.schema.database,
});

class CodeApp extends Component {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      <div className='code-app'>
        <div className='wallpaper-code'></div>
        <DbCodeContainer/>
        <CodeServerContainer/>
        <CodeClientContainer/>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(CodeApp);
