import React from 'react';
import './query.css';
import { connect } from 'react-redux';
import CreateQuerySidebar from './sidebar/create-query-sidebar';

const mapStateToProps = store => ({
  queryName: store.data.queryName,
  queryField: store.data.graphQLTypeOptions
  queryType: store.data.graphQLSearchOptions
})

const QueryCodeContainer = () => {
  const queryBuilder = (`
  
 {
    query type {
           name  
           field { 
            name
             type {
               name
             }
          }
     }
 }

`);


  return (
    <div className="query-code-container">
      Query-Code Container
      <pre>
        {queryBuilder}
      </pre>
    </div>
  );
};

export default connect(mapStateToProps, null) (QueryCodeContainer);
