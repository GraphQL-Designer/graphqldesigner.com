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
});

const mapDispatchToProps = dispatch => ({
  exportTable: table => dispatch(actions.exportTable(table)),
  //saveTable: table => dispatch(actions.saveTable(table)) 
});
 
class MainNav extends React.Component {
  constructor(props) {
    super(props);
    this.handleExport = this.handleExport.bind(this)
  }

  handleExport(){
    const data = Object.assign({}, {data: this.props.tables}, {
      database: 'MongoDB'
    })
    console.log('data', data)
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
        var element = document.createElement("a");
        element.href = file;
        element.download = "graphql.zip";
        element.click();
     })
     .catch((err) => console.log(err))
    }

  
  render() {
    return (
    <nav id="navbar">
      <div id="nav-left">
        <FlatButton label="New Project" />
        <FlatButton label="Export Code" onClick={this.handleExport}/>
      </div>
      <div id="nav-misd">
      </div>
      <div id='nav-right'>
        <FlatButton label="Logout" />
      </div>
    </nav>
   );
 }
}
export default connect (mapStateToProps, mapDispatchToProps)(MainNav);