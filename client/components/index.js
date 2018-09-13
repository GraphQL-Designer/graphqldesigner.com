import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/actions.js';

//Components
import './index.css';
import Welcome from './welcome/welcome.js';
import SchemaApp from './schema/schema-app.js';
import QueryApp from './query/query-app.js';
import Sidebar from './sidebar/sidebar.js'


const mapStateToProps = store => ({
  test: store.data.test, //we use store.data, because of index.js reduce function
});

const mapDispatchToProps = dispatch => ({
  chooseDatabase: dbName => dispatch(actions.chooseDatabase(dbName)),
})

class Index extends Component {
  constructor(props) {
    super(props);
  }  
  render() {
    return (
      <div>
        <h1 style={{marginTop: '100px'}}>GraphQL Designer Coming Soon</h1>
        <Welcome chooseDatabase={this.props.chooseDatabase}/>
        <Router>
          <div>
            <ul>
              <li>
                <Link to='/public/schemas'>Schemas</Link>
              </li>
              <li>
                <Link to='/public/queries'>Queries</Link>
              </li>
            </ul>
            <Route path="/public/schemas" render={() => <SchemaApp />}/>
            <Route path="/public/queries" component={QueryApp} />
          </div>
        </Router>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);