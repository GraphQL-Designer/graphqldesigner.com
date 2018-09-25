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
  tables: store.schema.tables,
  selectedTable: store.schema.selectedTable,
  tableName: store.schema.selectedTable.type,
  tableID: store.schema.selectedTable.tableID,
  database: store.general.database,
  selectedTable: store.schema.selectedTable
})

const mapDispatchToProps = dispatch => ({
  tablesToMongoFormat: () => dispatch(actions.tablesToMongoFormat()),
  saveTableDataInput: database => dispatch(actions.saveTableDataInput(database)),
  tableNameChange: tableName => dispatch(actions.handleTableNameChange(tableName)),
  idSelector: () => dispatch(actions.handleTableID()),
  openTableCreator: () => dispatch(actions.openTableCreator()),
  handleSnackbarUpdate: (status) => dispatch(actions.handleSnackbarUpdate(status))
})

class CreateTable extends React.Component {
  constructor(props) {
    super(props);

    this.saveTableDataInput = this.saveTableDataInput.bind(this);
    this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleOpenTableCreator = this.handleOpenTableCreator.bind(this);
    this.handleSnackbarUpdate = this.handleSnackbarUpdate.bind(this);
  }

  capitalizeFirstLetter(string) {
    if(string){
      const newString = string.replace(' ', '');
      return newString.charAt(0).toUpperCase() + newString.slice(1);
    }
  }

  handleSnackbarUpdate(snackBarOn, message){
    this.props.handleSnackbarUpdate({open: snackBarOn, message})
  }

  saveTableDataInput(e, database){
    e.preventDefault();
    let error = false;

    //remove whitespace
    let name = this.props.selectedTable.type.replace(/[^\w]/gi, '');

    
    if(name.length > 0) {
      this.props.tableNameChange(name)
      // document.getElementById('tableName').value = name;
      
      //capitalize first letter
      name = name.charAt(0).toUpperCase() + name.slice(1);
      this.props.tableNameChange(name)
      //get list of table indexes 
      const listTableIndexes = Object.getOwnPropertyNames(this.props.tables);

      // remove the selected table from list of tables if updating to prevent snackbar from displaying table error
      if(this.props.selectedTable.tableID !== -1){
        listTableIndexes.splice(listTableIndexes.indexOf(String(this.props.selectedTable.tableID)),1);
      }

      for(let x = 0; x < listTableIndexes.length; x += 1){
        if(this.props.tables[listTableIndexes[x]].type === name){
          error = true;
        }
      }      

      if(error){
        this.handleSnackbarUpdate(true, 'Error: Table name already exist'); 
      } else {
        //save or update table
        this.props.saveTableDataInput(database)
        this.handleSnackbarUpdate(false, '');
      }
      
    }
  }

  handleChange(e){
    this.props.tableNameChange(e.target.value);
  }

  handleCheck(){
    this.props.idSelector()
  }

  handleOpenTableCreator(event){
    this.props.openTableCreator()
  }

  render(){
    function tableName(tableID, tables) {
      if (tableID >= 0) {
        return <h2>{tables[tableID].type} Table</h2>
      }
      return <h2>Create Table</h2>
    }
 
    // function checkedValue(selectedTable) {
    //   console.log(selectedTable.fields)
    //   if (!!selectedTable.fields) {
    //     if (!!selectedTable.fields[0]) {
    //       if (selectedTable.fields[0].name) {
    //         return true;
    //       }
    //     }
    //   }
    //   return false;
    // }

    return (
      <div id='newTable' key={this.props.tableID}>

        {(this.props.tableID >= 0) && 
        <FlatButton
          id='back-to-create'
          label="Create Table"
          icon={<KeyboardArrowLeft />}
          onClick={this.handleOpenTableCreator}
        />}

        <form id='create-table-form' onSubmit={(e) => this.saveTableDataInput(e, this.props.database)}>
          {tableName(this.props.tableID, this.props.tables)}

          <TextField
            // hintText="Table Name"
            floatingLabelText="Table Name"
            fullWidth={true}
            autoFocus
            onChange={this.handleChange}
            value={this.props.tableName}
          />
          <h5 style={{textAlign: 'center', marginTop: '-4px'}}>( Singular naming convention )</h5>
          <Checkbox
            style={{marginTop: '10px'}}
            label="Unique ID"
            onCheck={this.handleCheck}
            id='idCheckbox'
            checked={!!this.props.selectedTable.fields[0]}
            disabled={this.props.database === 'MongoDB'}
          />
          <RaisedButton 
            label={this.props.tableID >= 0 ? 'Update Table' : 'Create Table'}
            fullWidth={true}
            secondary={true} 
            type='submit'
            style={{marginTop: '25px'}}
            />
        </form>
        {/* <div id='loader-container'>
          <Loader/>
        </div> */}
      </div>
    );
  }
}

  export default connect(mapStateToProps, mapDispatchToProps)(CreateTable);