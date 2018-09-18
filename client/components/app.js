import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions.js';

//Components
import './app.css';
import Welcome from './welcome/welcome.js';
import SchemaApp from './schema/schema-app.js';
import QueryApp from './query/query-app.js';
import GraphqlLoader from './loader';

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
    this.handleTabSelect = this.handleTabSelect.bind(this)
  }  

  handleTabSelect(event){
    console.log(event.target.innerHTML)
    this.props.chooseApp(event.target.innerHTML)
  }

  render() {
     // toggle between the different apps: Schema, Query, and Code
    let app = ''
    if (this.props.appSelected === 'Schemas') app = <SchemaApp/>
    else if (this.props.appSelected === 'Queries') app = <QueryApp/>

    return (
      <div className='app-container'>
        <div className='app-header'>
          <h1 style={{marginTop: '100px'}}>GraphQL Designer Coming Soon</h1>
          <GraphqlLoader />
        </div>
        <Welcome chooseDatabase={this.props.chooseDatabase}/>
          <div className='app-body-container'>
            <ul>
              <li onClick={this.handleTabSelect}>Schemas</li>
              <li onClick={this.handleTabSelect}>Queries</li>
            </ul>
            {app}
          </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);