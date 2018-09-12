import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import WelcomeBox from './welcome';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

//Components
import './index.css';
import Welcome from './welcome/welcome.js';
import SchemaApp from './schema/schema-app.js';
import QueryApp from './query/query-app.js';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'hi'
    };
  }  
  render() {
    return (
      <div>
        <h1 style={{marginTop: '100px'}}>GraphQL Designer Coming Soon</h1>
        <Welcome />
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

            <Route path="/public/schemas" render={() => <SchemaApp test={this.state.test} />}/>
            <Route path="/public/queries" component={QueryApp} />
          </div>
        </Router>
      </div>
    )
  }
}

export default Index;