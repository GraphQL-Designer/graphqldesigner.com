import React from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import * as actions from '../../actions/actions';

// styling
import './navbar.css';

// components
import Team from './team/team-button.jsx';
import ExportCode from './export-code/export-button.jsx';
// import Info from './info/info';

const mapDispatchToProps = dispatch => ({
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
});

const MainNav = ({ handleNewProject }) => (
  <div>
    <nav id="navbar">
      <div id="nav-left">
        <img alt="" id="logo" src="./images/Logo.svg" />
        <FlatButton label="New Project" onClick={() => handleNewProject(true)} />
        <ExportCode />
      </div>
      <div id="nav-right">
        {/* <Info/> */}
        <Team />
        <a href="https://github.com/GraphQL-Designer/graphqldesigner.com">
          <img alt="" src="./images/githubicon.png" />
        </a>
      </div>
    </nav>
  </div>
);


export default connect(
  null,
  mapDispatchToProps,
)(MainNav);
