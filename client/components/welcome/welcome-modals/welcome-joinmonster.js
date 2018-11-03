import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const WelcomeIntro = props => {
  const styles = {
    border: '1px solid white',
    width: '125px',
    fontSize: '1.2em',
    color: 'white',
  };
  return (
    <div>
      <div id='subheading'>Use Join Monster?</div>
      <br/>
      <p id='join-monster'>Join Monster is a query planner between GraphQL and SQL for the Node.js graphql-js reference implementation. It's a function that takes a GraphQL query and dynamically translates GraphQL to SQL for efficient, batched data retrieval before resolution. It fetches only the data you need - nothing more, nothing less.</p>
      <br/>
      <hr className='welcome-hr' />
      <div id='buttonsContainer'>
        <RaisedButton onClick={props.handleWelcomeVersion.bind(null, `${props.SQLType}+JoinMonster`, true)} buttonStyle={styles}>
          Yes
        </RaisedButton>
        <RaisedButton onClick={props.handleWelcomeVersion.bind(null, props.SQLType, true)} buttonStyle={styles}>
          No
        </RaisedButton>
      </div>
    </div>
  )
}

export default WelcomeIntro;