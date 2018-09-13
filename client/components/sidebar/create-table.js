import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

import './sidebar.css';

const mapDispatchToProps = dispatch => ({
  createTable: tableName => dispatch(actions.addTable(tableName)),
})

class CreateTable extends React.Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNullChange = this.handleNullChange.bind(this);
    this.handleUniqueChange = this.handleUniqueChange.bind(this);
    this.createTable = this.createTable.bind(this);
    this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
  }
  
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleToggle () {this.setState({open: !this.state.open})};

  handleChange (event, index, typeValue) {
    event.preventDefault();
    this.setState({typeValue});
  };
  handleNullChange (event, index, nullValue) {
    event.preventDefault();
    this.setState({nullValue});
  };
  handleUniqueChange (event, index, uniqueValue) {
    event.preventDefault();
    this.setState({uniqueValue});
  };

  createTable(e){
    e.preventDefault();
    let tableName = document.getElementById('tableName');
    this.props.createTable(this.capitalizeFirstLetter(tableName.value));
    tableName.value = '';
  }

  render(){
    return (
      <div id='newtable'>
        <h4>New Table</h4>
        <form >
          <input type='text' id='tableName' name='tableName' placeholder='Name' />
          <input type='submit' value='Create' className='btn-outline-success btn-lg' onClick={this.createTable}/>
        </form>
      </div>
    );
  }
}

  export default connect(null, mapDispatchToProps)(CreateTable);