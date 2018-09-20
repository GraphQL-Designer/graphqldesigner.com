import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions.js';

// components
import Loader from '../../loader/index.js'

// styles
import TextField from 'material-ui/TextField'; 
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import './sidebar.css';

const mapDispatchToProps = dispatch => ({
  createTable: tableName => dispatch(actions.addTable(tableName)),
})

class CreateTable extends React.Component {
  constructor(props) {
    super(props);

    this.createTable = this.createTable.bind(this);
    this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
  }
  
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  createTable(e){
    e.preventDefault();
    let tableName = document.getElementById('tableName');
    let uniqueID = document.querySelector('#idCheckbox').checked;
    this.props.createTable({name: this.capitalizeFirstLetter(tableName.value), uniqueID: uniqueID});
    tableName.value = '';
    document.getElementById('idCheckbox').checked = false;
  }

  render(){
    return (
      <div id='newTable'>
        <form onSubmit={this.createTable}>
          <TextField
            hintText="Table Name"
            floatingLabelText="Table Name"
            id='tableName'
            fullWidth={true}
            autoFocus
          />  
          <h6>(Works with singular naming convention)</h6>
          <Checkbox
            label="Unique ID"
          
            id='idCheckbox'
          />
          {/* <span>Unique ID:<input id='idCheckbox' type='checkbox'/></span> */}
          <RaisedButton 
            label="Create Table" 
            fullWidth={true}
            secondary={true} 
            value='Create' 
            type='submit'
          />
        </form>
        <div id='loader-container'>
          <Loader/>
        </div>
      </div>
    );
  }
}

  export default connect(null, mapDispatchToProps)(CreateTable);