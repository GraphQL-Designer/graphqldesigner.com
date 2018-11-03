import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';

// styling
import './about.css';

class About extends React.Component {
  render() {
    return (
      <Card>
        <CardTitle
          title="GraphQL Designer"
          subtitle="Rapidly prototype a full stack CRUD implementation of GraphQL with React" 
          className='about-container'
        />
        <CardText>
          With a few simple inputs, our dev tool auto generates code for download, to start and implement your new application including GraphQL root queries, schemas, mutations, and client queries. 
          Also available for download are the NoSQL schemas or SQL build scripts, and a server file
        </CardText>
        </Card>
    );
  }
}

export default About;
