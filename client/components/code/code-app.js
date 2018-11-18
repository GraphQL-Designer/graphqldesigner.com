import React, { Component } from 'react';
import { connect } from 'react-redux';

// components
import CodeClientContainer from './code-containers/client-code.js';
import CodeServerContainer from './code-containers/server-code.js';
import DbCodeContainer from './code-containers/db-code.js'

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
