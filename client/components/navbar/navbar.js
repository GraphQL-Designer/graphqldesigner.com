import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// styling
import './navbar.css';

// google material ui components
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

// components
import Team from './team/team-container.js';
import ExportCode from './export-code/export-button.js'
// import Info from './info/info.js';


const mapStateToProps = store => ({
  tables: store.schema.tables,
  database: store.schema.database,
});

const mapDispatchToProps = dispatch => ({
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
});

class MainNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: false,
      loader: false,
    };
    // this.handleInfoOpen = this.handleInfoOpen.bind(this);
    this.handleTeamOpen = this.handleTeamOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handleNewProject = this.handleNewProject.bind(this);
    this.changeSetsToArrays = this.changeSetsToArrays.bind(this); 
  }

  changeSetsToArrays() {
    const tables = this.props.tables;
    const changedTables = {};
    for (let tableId in tables) {
      const changedFields = {};
      for (let fieldId in tables[tableId].fields) {
        const field = tables[tableId].fields[fieldId];
        const refBy = field.refBy;
        if (refBy.size > 0) {
          const refByArray = [];
          refBy.forEach(ele => {
            refByArray.push(ele);
          });
          changedFields[fieldId] = (Object.assign({}, field, { 'refBy': refByArray }));
        }
      }
      if (Object.keys(changedFields).length > 0) {
        const fields = Object.assign({}, tables[tableId].fields, changedFields);
        changedTables[tableId] = (Object.assign({}, tables[tableId], { 'fields': fields }));
      }
    }
    const tableData = Object.assign({}, tables, changedTables);
    const data = Object.assign({}, { 'data': tableData }, { 'database': this.props.database });
    return data; 
  }

  handleExport() {
    this.setState({
      loader: true,
    });

    // JSON.stringify doesn't work with Sets. Change Sets to arrays for export
    const data = this.changeSetsToArrays()
    setTimeout(() => {
      fetch('/write-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.blob())
        .then(blob => URL.createObjectURL(blob))
        .then((file) => {
          let element = document.createElement('a');
          document.body.appendChild(element);
          element.href = file;
          element.download = 'graphql.zip';
          element.click();
          this.setState({
            modal: false,
          });
        })
        .catch((err) => {
          this.setState({
            modal: false,
          });
          console.log(err);
        });
    }, 2500);
  }

  handleNewProject() {
    this.props.handleNewProject(true);
  }

  handleTeamOpen() {
    this.setState({ team: true });
  }

  handleClose() {
    this.setState({ team: false, info: false });
  }

  render() {
    return (
      <div>
        <nav id="navbar">
          <div id="nav-left">
            <img id='logo' src='./images/Logo.svg' />
            <FlatButton label="New Project" onClick={this.handleNewProject} />
            <ExportCode/>
          </div>
          <div id="nav-right">
            {/* <Info/> */}
            <FlatButton onClick={this.handleTeamOpen}>Team</FlatButton>
            <Dialog
              modal={true}
              open={this.state.team}
              onClose={this.handleClose}
            >
              <Team />
              <FlatButton style={{ justifyContent: 'flex-end' }} onClick={this.handleClose} >
                Cancel  
              </FlatButton>
            </Dialog>  
            <a href="https://github.com/GraphQL-Designer/graphqldesigner.com">
              <img src="./images/githubicon.png" />
            </a>
          </div>
        </nav>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainNav);
