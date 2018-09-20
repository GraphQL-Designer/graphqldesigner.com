import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions.js';

// components
import Loader from '../../loader/index.js'

// styles
import TextField from 'material-ui/TextField'; 
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import FlatButton from 'material-ui/FlatButton';
import './sidebar.css';

const mapStateToProps = store => ({
  tableName: store.data.selectedTable.type,
  tableIDRequested: store.data.selectedTable.idRequested,
  tableID: store.data.selectedTable.tableID,
  database: store.data.database
})

const mapDispatchToProps = dispatch => ({
  saveTableDataInput: () => dispatch(actions.saveTableDataInput()),
  tableNameChange: tableName => dispatch(actions.handleTableNameChange(tableName)),
  idSelector: () => dispatch(actions.handleTableID()),
  openTableCreator: () => dispatch(actions.openTableCreator())
})

class CreateTable extends React.Component {
  constructor(props) {
    super(props);

    this.saveTableDataInput = this.saveTableDataInput.bind(this);
    this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOpenTableCreator = this.handleOpenTableCreator.bind(this)
  }
  
  capitalizeFirstLetter(string) {
    
    if(string){
      const newString = string.replace(' ', '');
      // console.log('string: ', string);
      // console.log('newString: ', newString);
      return newString.charAt(0).toUpperCase() + newString.slice(1);
    }
  }

  saveTableDataInput(e){
    e.preventDefault();
    this.props.saveTableDataInput()
    document.getElementById('tableName').value = '';
  }

  handleChange(e){
    this.props.tableNameChange(e.target.value);
  }

  handleClick(){
    this.props.idSelector()
  }

  handleOpenTableCreator(event){
    this.props.openTableCreator()
  }

  render(){

    
    return (
      <div id='newTable' key={this.props.tableID}>

        {(this.props.tableID >= 0) && 
        <FlatButton
          id='back-to-create'
          label="Create Table"
          icon={<KeyboardArrowLeft />}
          onClick={this.handleOpenTableCreator}
        />}

        <form onSubmit={this.saveTableDataInput}>
          <TextField
            // hintText="Table Name"
            floatingLabelText="Table Name"
            id='tableName'
            fullWidth={true}
            autoFocus
            onChange={this.handleChange}
            // name='type'
            value={this.capitalizeFirstLetter(this.props.tableName)}
            // value={this.props.tableName}
          />
          <h6>(Works with singular naming convention)</h6>
          <Checkbox
            label="Unique ID"
            onCheck={this.handleClick}
            id='idCheckbox'
            checked={this.props.database === 'MongoDB'? true : this.props.tableIDRequested}
            disabled={this.props.database === 'MongoDB'}
          />
          <RaisedButton 
            label={this.props.tableID >= 0 ? 'Update Table' : 'Create Table'}
            fullWidth={true}
            secondary={true} 
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

  export default connect(mapStateToProps, mapDispatchToProps)(CreateTable);