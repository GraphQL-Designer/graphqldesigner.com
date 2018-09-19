import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';


// styling
import FlatButton from 'material-ui/FlatButton';
import './navbar.css';

// componenets
import GraphqlLoader from '../loader/index.js';


const mapStateToProps = store => ({
  tables: store.data.tables,
  database: store.data.database,
  createTableState: store.data.createTableState
});

const mapDispatchToProps = dispatch => ({
  exportTable: table => dispatch(actions.exportTable(table)),
  openTableCreator: tableState => dispatch(actions.openTableCreator(tableState))
  //saveTable: table => dispatch(actions.saveTable(table)) 
});
 
class MainNav extends React.Component {
  constructor(props) {
    super(props);
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

  handleExport(event){
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

     //.then(res => console.log(res))
    //  .then(res => new Response(res.body))
    //  .then(response => {
    //    console.log('res', response)
    //    console.log('res.body==>>>', response.body)
    //    return response.blob()
    //   })
    //  .then(blob => {
    //    console.log('blob', blob)
    //    return URL.createObjectURL(blob)
    //  })
    //  .then(file => {
    //     var element = document.createElement("a");
    //     element.href = file;
    //     element.download = "graphql.txt";
    //     console.log('file', file)
    //     element.click();
    //  })

     .catch((err) => console.log(err))
    }

  
  render() {
    // depending on the database selected, the create button language will reflect the database
    let createButtonText = 'Create Schema'
    if (this.props.database === 'MongoDB') createButtonText='Create Schema'
    else if (this.props.database === 'SQL') createButtonText='Create Table'

    return (
    <nav id="navbar">
      <div id="nav-left">
        <FlatButton label="New Project" />
        {/* <FlatButton label="Save" />
        <FlatButton label="Load" /> */}
        <FlatButton label="Export Code" />
      </div>
      <div id="nav-mid">
        <FlatButton label={createButtonText} onClick={this.handleCreate} />
      </div>
      <div id='nav-right'>
        <FlatButton label="Logout" />
      </div>
    </nav>
   );
 }
}
export default connect (mapStateToProps, mapDispatchToProps)(MainNav);




