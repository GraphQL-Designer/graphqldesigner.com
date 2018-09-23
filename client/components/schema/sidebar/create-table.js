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
import Snackbar from 'material-ui/Snackbar';
import './sidebar.css';

const style = {
  snackBarStyle: {
    backgroundColor: 'rgb(255,66,128)',
    color: 'black'
  }
};

const mapStateToProps = store => ({
  tables: store.data.tables,
  tableName: store.data.selectedTable.type,
  tableIDRequested: store.data.selectedTable.idRequested,
  tableID: store.data.selectedTable.tableID,
  database: store.data.database,
  inputError: store.data.inputError
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

    this.state = {
      open: false,
    }

    this.saveTableDataInput = this.saveTableDataInput.bind(this);
    this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOpenTableCreator = this.handleOpenTableCreator.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this);
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
    if(this.props.inputError.status !== -1){
      this.setState({
        open: true,
      })
    } else {
      this.setState({
        open: false,
      })
    }
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

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  render(){
    function tableName(tableID, tables) {
      if (tableID >= 0) {
        return <h2>{tables[tableID].type} Table</h2>
      }
      return <h2>Create Table</h2>
    }
    
    return (
      <div id='newTable' key={this.props.tableID}>

        {(this.props.tableID >= 0) && 
        <FlatButton
          id='back-to-create'
          label="Create Table"
          icon={<KeyboardArrowLeft />}
          onClick={this.handleOpenTableCreator}
        />}

        <form id='create-table-form' onSubmit={this.saveTableDataInput}>
          {tableName(this.props.tableID, this.props.tables)}

          <TextField
            // hintText="Table Name"
            floatingLabelText="Table Name"
            id='tableName'
            fullWidth={true}
            autoFocus
            onChange={this.handleChange}
            value={this.props.tableName || ''}
          />
          <h5 style={{textAlign: 'center', marginTop: '-4px'}}>( Singular naming convention )</h5>
          <Checkbox
            style={{marginTop: '10px'}}
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
            style={{marginTop: '25px'}}
            />
        </form>
        <div id='loader-container'>
          <Loader/>
        </div>
        <Snackbar
          open={this.state.open}
          message={this.props.inputError.dupTable}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
          bodyStyle={style.snackBarStyle}
        />
      </div>
    );
  }
}

  export default connect(mapStateToProps, mapDispatchToProps)(CreateTable);