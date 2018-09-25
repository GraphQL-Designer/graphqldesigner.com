import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// styling
import FlatButton from 'material-ui/FlatButton';
import './navbar.css';

// componenets
import GraphqlLoader from '../loader/index.js';
import Welcome from './../welcome/welcome.js';

const mapStateToProps = store => ({
  tables: store.schema.tables,
  database: store.general.database
});

const mapDispatchToProps = dispatch => ({
  exportTable: table => dispatch(actions.exportTable(table)),
  // saveTable: table => dispatch(actions.saveTable(table))
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
  tablesToMongoFormat: () => dispatch({ type: 'TABLES_TO_MONGO_FORMAT' })
});

class MainNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.handleExport = this.handleExport.bind(this);
    this.handleNewProject = this.handleNewProject.bind(this);
  }

  handleExport() {
    this.setState({
      modal: true
    });
    const data = Object.assign(
      {},
      { data: this.props.tables },
      {
        database: 'MongoDB'
      }
    );
    setTimeout(() => {
      fetch('http://localhost:4100/write-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(res => res.blob())
        .then(blob => URL.createObjectURL(blob))
        .then(file => {
          var element = document.createElement('a');
          element.href = file;
          element.download = 'graphql.zip';
          element.click();
          this.setState({
            modal: false
          });
        })
        .catch(err => {
          this.setState({
            modal: false
          });
          console.log(err);
        });
    }, 2500);
  }

  handleNewProject() {
    this.props.handleNewProject(true);
  }

  render() {
    return (
      <div>
        <nav id="navbar">
          <div id="nav-left">
            <FlatButton label="New Project" onClick={this.handleNewProject} />
            <FlatButton style={{ color: '#FF4280' }} label="Export Code" onClick={this.handleExport} />
          </div>
          <div id="nav-misd" />
          <div id="nav-right">
            <FlatButton label="Logout" />
          </div>
        </nav>
        {this.state.modal && (
          <div className="overlay">
            <div>
              <GraphqlLoader />
              <h2 style={{ color: 'white' }}>Creating Your Code!</h2>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainNav);
