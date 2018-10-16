import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// styling
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import './welcome.css';

const mapStatetoProps = store => ({
  projectReset: store.schema.projectReset,
});

const mapDispatchToProps = dispatch => ({
  tablesToMongoFormat: () => dispatch({ type: 'TABLES_TO_MONGO_FORMAT' }),
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
});

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleDatabaseClick = this.handleDatabaseClick.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ open: true });
    }, 750);
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleDatabaseClick(event) {
    this.props.handleNewProject(false);
    this.props.chooseDatabase(event.target.innerHTML);
    if (event.target.innerHTML === 'MongoDB') this.props.tablesToMongoFormat();
  }

  render() {
    const styles = {
      border: '1px solid white',
      width: '125px',
      fontSize: '1.2em',
      color: 'white',
    };
    return (
      <div>
        <Dialog
          title="GraphQL Designer"
          modal={true}
          open={this.props.projectReset}
          onRequestClose={this.handleClose}
          className='welcome-container'
          paperClassName='welcome-box'
        >
          <div id='subheading'>Rapidly prototype a full stack React GraphQL Application.</div>
          <div className='iconContainer'>
            <img id='icon_graphql' src='./images/graphql.png' />
            <img id='icon_express' src='./images/express.png' />
            <img id='icon_react' src='./images/react.png' />
          </div>
          <hr className='welcome-hr' />
          <h4>Select your database type</h4>
          <div id='buttonsContainer'>
            <RaisedButton onClick={this.handleDatabaseClick} buttonStyle={styles}>
              MongoDB
            </RaisedButton>
            <RaisedButton onClick={this.handleDatabaseClick} buttonStyle={styles}>
              MySQL
            </RaisedButton>
            <RaisedButton onClick={this.handleDatabaseClick} buttonStyle={styles}>
              PostgreSQL
            </RaisedButton>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Welcome);
