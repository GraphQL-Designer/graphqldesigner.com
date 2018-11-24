import React from 'react';
import { connect } from 'react-redux';
import buildClientQueries from '../../../../utl/create_file_func/client_queries';
import buildClientMutations from '../../../../utl/create_file_func/client_mutations';

// styling
import '../code.css';

const mapStateToProps = store => ({
  tables: store.schema.tables,
});

const CodeClientContainer = ({ tables }) => {
  const clientQueries = buildClientQueries(tables);
  const clientMutations = buildClientMutations(tables);

  return (
    <div id="code-container-client">
      <h4 className="codeHeader">Client Queries</h4>
      <hr />
      <pre>
        {clientQueries}
      </pre>
      <br />
      <br />
      <h4 className="codeHeader">Client Mutations</h4>
      <hr />
      <pre>
        {clientMutations}
      </pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeClientContainer);
