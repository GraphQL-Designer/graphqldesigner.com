import React from 'react';
import { connect } from 'react-redux';
import './code.css';

const CodeServerContainer = (props) => {
  const enter = `
  `;
  const tab = ` `;
    let serverCode = `const graphql = require('graphql');${enter}`;
function parseGraphqlMongoServer(data) {
    for (const prop in data) {
      serverCode += buildDbModelRequirePaths(data[prop]);
    }

    serverCode += `
  const { 
      GraphQLObjectType,
      GraphQLSchema,
      GraphQLID,
      GraphQLString, 
      GraphQLInt, 
      GraphQLList,
      GraphQLNonNull
  } = graphql;
  ${enter}`;


    return serverCode += `${enter}${tab}})${enter}});${enter}${enter}`;
  }
  return (
    <div className="code-container-middle">
      <pre>
        {serverCode}
      </pre>
    </div>
  );
};

export default connect(null, null)(CodeServerContainer);
