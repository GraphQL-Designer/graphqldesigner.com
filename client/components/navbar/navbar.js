import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// styling
import './navbar.css';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

// componenets
import GraphqlLoader from '../loader/index.js';
import About from './about'

const mapStateToProps = store => ({
  tables: store.schema.tables,
  database: store.schema.database,
});

const mapDispatchToProps = dispatch => ({
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
  tablesToMongoFormat: () => dispatch({ type: 'TABLES_TO_MONGO_FORMAT' }),
});

class MainNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      modal: false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);   
    this.handleClose = this.handleClose.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handleNewProject = this.handleNewProject.bind(this);
  }

  handleExport() {
    this.setState({
      modal: true,
    });

    // JSON.stringify doesn't work with Sets. Change Sets to arrays for export
    const tables = this.props.tables;
    const changedTables = {}
    for (let tableId in tables) {
      const changedFields = {}
      for (let fieldId in tables[tableId].fields) {
        const field = tables[tableId].fields[fieldId];
        const refBy = field.refBy
        if (refBy.size > 0) {
          const refByArray = []
          refBy.forEach(ele => {
            refByArray.push(ele);
          })
          changedFields[fieldId] = (Object.assign({}, field, { 'refBy': refByArray }))
        }
      }
      if (Object.keys(changedFields).length > 0) {
        const fields = Object.assign({}, tables[tableId].fields, changedFields)
        changedTables[tableId] = (Object.assign({}, tables[tableId], { 'fields': fields }))
      }
    }
    const tableData = Object.assign({}, tables, changedTables)
    const data = Object.assign({}, { 'data': tableData }, { 'database': this.props.database })

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
  
  handleClickOpen = () => {
    this.setState({ open: true });
  };


  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <nav id="navbar">
          <div id="nav-left">
          <img id='logo' src='./images/Logo.svg' />
            <FlatButton label="New Project" onClick={this.handleNewProject} />
            <FlatButton style={{ color: '#FF4280' }} label="Export Code" onClick={this.handleExport} />
          </div>
          <div id="nav-right">
            {/* <FlatButton onClick={this.handleClickOpen}>About</FlatButton> */}
            <Dialog
              modal={true}
              open={this.state.open}
              onClose={this.handleClose}
              autoScrollBodyContent={true}
              aria-labelledby="scroll-dialog-title"
              className='about-container'
              paperClassName='about-box'
            >
            {/* <About /> */}
            <FlatButton className='about-btn' primary={true} onClick={this.handleClose} >
              Cancel  
            </FlatButton>
            </Dialog>  
            <a href="https://github.com/GraphQL-Designer/graphqldesigner.com"> 
              <img src="./images/githubicon.png" />
            </a>  
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
  mapDispatchToProps,
)(MainNav);
