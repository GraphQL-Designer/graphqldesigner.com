import React from 'react';
import { connect } from 'react-redux';
import buildServerCode from '../../../../utl/create_file_func/graphql_server.js' 

// styling
import '../code.css';

const mapStateToProps = store => ({
  database: store.schema.database,
  tables: store.schema.tables,
});

const CodeServerContainer = (props) => {
  const serverCode = buildServerCode(props.tables, props.database)
  return (
    <div id="code-container-server">
      <h4 className='codeHeader'>GraphQl Types, Root Queries, and Mutations</h4>
      <hr/>
      <pre>
        {serverCode}
      </pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeServerContainer);
