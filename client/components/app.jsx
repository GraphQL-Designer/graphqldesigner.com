import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

// Components
import MainNav from './navbar/navbar.jsx';
import Welcome from './welcome/welcome.jsx';
import SchemaApp from './schema/schema-app.jsx';
import CodeApp from './code/code-app.jsx';
//import QueryApp from './query/query-app.jsx';

// Material UI Components
import { Tabs, Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';

// Styling
import './app.css';

const style = {
  snackBarStyle: {
    backgroundColor: 'rgb(255,66,128)',
  },
  snackBarFont: {
    color: 'white',
  },
  tabStyle: {
    backgroundColor: 'rgb(38,42,48)',
    color: 'white',
  },
};

const mapStateToProps = store => ({
  snackBar: store.general.statusMessage,
});

const mapDispatchToProps = dispatch => ({
  handleSnackbarUpdate: status => dispatch(actions.handleSnackbarUpdate(status)),
});

const App = ({ snackBar, handleSnackbarUpdate }) => {
  function handleRequestClose() {
    handleSnackbarUpdate('');
  }

  return (
    <div className="app-container">
      <MainNav />
      <Welcome />
      <div className="app-body-container">
        <Tabs className="tabs">
          <Tab id="schemaTab" label="Schemas" style={style.tabStyle}>
            <SchemaApp />
          </Tab>
          {/* <Tab label="Queries" style={style.tabStyle}>
            <QueryApp />
          </Tab> */}
          <Tab label="Code" style={style.tabStyle}>
            <CodeApp />
          </Tab>
        </Tabs>
        <Snackbar
          open={!!snackBar}
          message={snackBar}
          autoHideDuration={3000}
          onRequestClose={handleRequestClose}
          bodyStyle={style.snackBarStyle}
          contentStyle={style.snackBarFont}
        />
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
