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

const mapStateToProps = store => ({
  tableName: store.data.selectedTable.type,
  tableIDRequested: store.data.selectedTable.idRequested,
  tableID: store.data.selectedTable.tableID
})

const mapDispatchToProps = dispatch => ({
  saveTableDataInput: () => dispatch(actions.saveTableDataInput()),
  tableNameChange: tableName => dispatch(actions.handleTableNameChange(tableName)),
  idSelector: () => dispatch(actions.handleTableID())
})

class CreateTable extends React.Component {
  constructor(props) {
    super(props);

    this.saveTableDataInput = this.saveTableDataInput.bind(this);
    this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  saveTableDataInput(e){
    e.preventDefault();
    this.props.saveTableDataInput()
  }

  handleChange(e){
    this.props.tableNameChange(e.target.value);
  }

  handleClick(){
    this.props.idSelector()
  }

  render(){
    return (
      <div id='newTable' key={this.props.tableID}>
        <form onSubmit={this.saveTableDataInput}>
          <TextField
            // hintText="Table Name"
            floatingLabelText="Table Name"
            id='tableName'
            fullWidth={true}
            autoFocus
            onChange={this.handleChange}
            // name='type'
            value={this.props.tableName}
          />  
          <h6>(Works with singular naming convention)</h6>
          <Checkbox
            label="Unique ID"
            onCheck={this.handleClick}
            id='idCheckbox'
            checked={this.props.tableIDRequested}
          />
          {/* <span>Unique ID:<input id='idCheckbox' type='checkbox'/></span> */}
          <RaisedButton 
            label={this.props.tableID >= 0 ? 'Update Table' : 'Create Table'}
            fullWidth={true}
            secondary={true} 
            type='submit'
            />
          {/* // >{this.props.tableID >= 0 ? 'Update Table' : 'Create Table'}</RaisedButton> */}
        </form>
        <div id='loader-container'>
          <Loader/>
        </div>
      </div>
    );
  }
}

  export default connect(mapStateToProps, mapDispatchToProps)(CreateTable);