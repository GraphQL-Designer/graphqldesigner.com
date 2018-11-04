import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// styling
import Dialog from 'material-ui/Dialog';
import './welcome.css';

//components
import WelcomeIntro from './welcome-modals/welcome-intro.js';
import WelcomeNoSQL from './welcome-modals/welcome-nosql.js';
import WelcomeSQL from './welcome-modals/welcome-sql.js';
import WelcomeJoinMonster from './welcome-modals/welcome-joinmonster.js';


const mapStatetoProps = store => ({
  projectReset: store.schema.projectReset,
});

const mapDispatchToProps = dispatch => ({
  chooseDatabase: dbName => dispatch(actions.chooseDatabase(dbName)),
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
});

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleWelcomeVersion = this.handleWelcomeVersion.bind(this); 
    this.state = {
      open: false,
      welcomeVersion: 'Intro',
      welcomeModal: <WelcomeIntro handleWelcomeVersion={this.handleWelcomeVersion}/>
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ open: true });
    }, 750);
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleWelcomeVersion(version, close, SQLType, event){ 
    if (close){
      this.props.handleNewProject(false);
      this.props.chooseDatabase(version)
      this.setState({
        open: false,
        welcomeModal: <WelcomeIntro handleWelcomeVersion={this.handleWelcomeVersion}/>
      })
    } else {
      switch(version) {
        case 'NoSQL':
          this.setState({welcomeModal: <WelcomeNoSQL handleWelcomeVersion={this.handleWelcomeVersion}/>});
          break; 
        case 'SQL':
          this.setState({welcomeModal: <WelcomeSQL handleWelcomeVersion={this.handleWelcomeVersion}/>});
          break; 
        case 'JoinMonster':
          this.setState({welcomeModal: <WelcomeJoinMonster SQLType={SQLType} handleWelcomeVersion={this.handleWelcomeVersion}/>});
          break; 
      }
    }
  }

  render() {
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
          {this.state.welcomeModal}
        </Dialog>
      </div>
    );
  }
}

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Welcome);
