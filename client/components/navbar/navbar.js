import React from 'react';
import { connect } from 'react-redux';
<<<<<<< HEAD
import * as actions from '../../actions/actions';

=======
import * as actions from '../../actions/actions.js';


// styling
import FlatButton from 'material-ui/FlatButton';
>>>>>>> 2ea10f8de656e0db6423ee346a12ce84240ae3c7
import './navbar.css';

// componenets
import GraphqlLoader from '../loader/index.js';


const mapStateToProps = store => ({
<<<<<<< HEAD
  tableIndex: store.data.tableIndex,
  tables: store.data.tables
=======
  tables: store.data.tables,
  database: store.data.database,
  createTableState: store.data.createTableState
>>>>>>> 2ea10f8de656e0db6423ee346a12ce84240ae3c7
});

const mapDispatchToProps = dispatch => ({
<<<<<<< HEAD
  createTable: tableIndex => dispatch(actions.createTable(tableIndex)),  
  exportFile: tables => dispatch(actions.exportFile(tables)), 
  saveFile: tables => dispatch(actions.saveFile(tables)) 

=======
  exportTable: table => dispatch(actions.exportTable(table)),
  openTableCreator: tableState => dispatch(actions.openTableCreator(tableState))
  //saveTable: table => dispatch(actions.saveTable(table)) 
>>>>>>> 2ea10f8de656e0db6423ee346a12ce84240ae3c7
});
 
class MainNav extends React.Component {
  constructor(props) {
    super(props);
<<<<<<< HEAD
    this.createTable = this.createTable.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
  }

  createTable(event){
    this.props.createTable(this.props.tableIndex);
  }
    
    saveFile(event){
      this.props.saveFile(this.props.tables);
    }
   
    
    exportFile(event){
=======
    this.handleExport = this.handleExport.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
  }

  handleCreate(){
    const schema = document.getElementById('tab')
    schema.click()
    // if the table is closed, open it. 
    if (!this.props.createTableState) {
      console.log('true')
      this.props.openTableCreator(true)
    }
  }

  handleExport(){
>>>>>>> 2ea10f8de656e0db6423ee346a12ce84240ae3c7
    const data = Object.assign({}, {data: this.props.tables}, {
      database: 'MongoDB'
    })
    fetch('http://localhost:4100/write-files', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
     })
     .then(res => res.blob())
     .then(blob => URL.createObjectURL(blob))
     .then(file => {
       console.log('file', file)
        var element = document.createElement("a");
        element.href = file;
        element.download = "graphql.zip";
        element.click();
     })
     .catch((err) => console.log(err))
    }

  
<<<<<<< HEAD
    render() {
      return (
        <nav className="navbar-nav fixed-top navbar-dark bg-light">
          <div className="navbar-nav-container">
            <div className="btn-group" role="group" aria-label="Basic example">
              <button type="button" className="btn btn-outline-secondary" onClick={this.createTable}>New Table</button>
              <button type="button" className="btn btn-secondary">Load</button>
              <button type="button" className="btn btn-secondary" onClick={this.saveFile}>Save</button>
              <button 
                className="btn btn-secondary"
                onClick={this.exportFile}
                >Export
              </button>    
            <div className="btn-group justify-content-end" role="group" aria-label="Basic example">
              <button className="btn btn-outline-success my-2 my-md-0" type="submit">Account</button>
              <button className="btn btn-outline-success my-2 my-md-0" type="submit">Logout</button>
            </div>
          </div>
          </div>
        </nav>
      );
    }
  }
=======
  render() {
    // depending on the database selected, the create button language will reflect the database
    let createButtonText = 'Create Schema'
    if (this.props.database === 'MongoDB') createButtonText='Create Schema'
    else if (this.props.database === 'SQL') createButtonText='Create Table'

    return (
    <nav id="navbar">
      <div id="nav-left">
        <FlatButton label="New Project" />
        <FlatButton label="Export Code" onClick={this.handleExport}/>
      </div>
      <div id="nav-mid">
        {/* <FlatButton label={createButtonText} onClick={this.handleCreate} /> */}
      </div>
      <div id='nav-right'>
        <FlatButton label="Logout" />
      </div>
    </nav>
   );
 }
}
>>>>>>> 2ea10f8de656e0db6423ee346a12ce84240ae3c7
export default connect (mapStateToProps, mapDispatchToProps)(MainNav);




