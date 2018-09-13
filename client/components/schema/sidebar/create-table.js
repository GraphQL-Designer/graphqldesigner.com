import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions.js';


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
        <h4>New Table</h4>
        <form >
          <input type='text' id='tableName' className='tableName' placeholder='Name' />
          <span>Unique ID:<input id='idCheckbox' type='checkbox'/></span>
          <input type='submit' value='Create' className='btn-outline-success btn-sm' onClick={this.createTable}/>
        </form>
      </div>
    );
  }
}

  export default connect(null, mapDispatchToProps)(CreateTable);