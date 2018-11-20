import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// styling
import './navbar.css';

// components
import FlatButton from 'material-ui/FlatButton';
import Team from './team/team-button.js';
import ExportCode from './export-code/export-button.js'
// import Info from './info/info.js';

const mapDispatchToProps = dispatch => ({
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
});

const MainNav = props => {
  return (
    <div>
      <nav id="navbar">
        <div id="nav-left">
          <img id='logo' src='./images/Logo.svg' />
          <FlatButton label="New Project" onClick={() => props.handleNewProject(true)} />
          <ExportCode/>
        </div>
        <div id="nav-right">
          {/* <Info/> */}
          <Team/>  
          <a href="https://github.com/GraphQL-Designer/graphqldesigner.com">
            <img src="./images/githubicon.png" />
          </a>
        </div>
      </nav>
    </div>
  );
}

export default connect(
  null,
  mapDispatchToProps,
)(MainNav);
