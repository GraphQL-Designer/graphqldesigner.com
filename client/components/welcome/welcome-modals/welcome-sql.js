import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const WelcomeSQL = props => {
  const styles = {
    border: '1px solid white',
    width: '125px',
    fontSize: '1.2em',
    color: 'white',
  };
  return (
    <div>
      <div id='subheading'>Rapidly prototype a full stack React GraphQL Application.</div>
      <div className='iconContainer'>
        <img id='icon_graphql' src='./images/graphql.png' />
        <img id='icon_express' src='./images/express.png' />
        <img id='icon_react' src='./images/react.png' />
      </div>
      <hr className='welcome-hr' />
      <h4>Select your Relational Database Management System</h4>
      <div id='buttonsContainer'>
        <RaisedButton onClick={props.handleWelcomeVersion.bind(null, 'JoinMonster', false, 'PostgreSQL')} buttonStyle={styles}>
          PostgreSQL
        </RaisedButton>
        <RaisedButton onClick={props.handleWelcomeVersion.bind(null, 'JoinMonster', false, 'MySQL')} buttonStyle={styles}>
          MySQL
        </RaisedButton>
      </div>
    </div>
  )
}

export default WelcomeSQL;