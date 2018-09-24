import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions.js';

// Styling 
import './app.css';
import {Tabs, Tab} from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
const tabStyle = {
  backgroundColor: 'rgb(38,42,48)',
  // backgroundColor: 'rgb(50,54,60)',

  color: 'white'
}

// Components
import MainNav from './navbar/navbar';
import Welcome from './welcome/welcome.js';
import SchemaApp from './schema/schema-app.js';
import QueryApp from './query/query-app.js';
import CodeApp from './code/code-app.js';

const mapStateToProps = store => ({
  appSelected: store.data.appSelected, //we use store.data, because of index.js reduce function
});

const mapDispatchToProps = dispatch => ({
  chooseApp: app => dispatch(actions.chooseApp(app)),
  chooseDatabase: dbName => dispatch(actions.chooseDatabase(dbName))
})

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }

    this.handleTabSelect = this.handleTabSelect.bind(this)
  }  

  handleTabSelect(event){
    this.props.chooseApp(event.target.innerHTML)
  }

  render() {
    return (
      <div className='app-container'>
        <MainNav />
        <Welcome chooseDatabase={this.props.chooseDatabase}/>
          <div className='app-body-container'>
            <Tabs className='tabs'>
              <Tab label="Schemas" style={tabStyle}>
                <SchemaApp className='schemaTest'/>
              </Tab>
              <Tab label="Queries" style={tabStyle}>
                <QueryApp/>
              </Tab>
              <Tab label="Code" style={tabStyle}>
                <CodeApp/>
              </Tab>
            </Tabs>
          </div>
          <Snackbar
            open={this.state.open}
            message={this.props.inputError.dupTable}
            autoHideDuration={3000}
            onRequestClose={this.handleRequestClose}
            // bodyStyle={style.snackBarStyle}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);