import React from 'react';
import { connect } from 'react-redux';

import './query.css';

const mapStateToProps = store => ({
  // queryName: store.query.queryName,
  // queryField: store.query.graphQLTypeOptions,
  // queryType: store.query.graphQLSearchOptions
  // tables: store.schema.tables
})

const CustomizedQueryContainer = (props) => {
  return (
    <div id='customized-query-container'>
      <h1>customized query container</h1>

    </div>
  )
}

export default connect(mapStateToProps, null)(CustomizedQueryContainer)