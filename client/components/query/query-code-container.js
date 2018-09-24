import React from 'react';
import './query.css';
//import { gql } from 'apollo-boost';
import CreateQuerySidebar from './sidebar/create-query-sidebar';

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

export default QueryCodeContainer;
