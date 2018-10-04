import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions.js';

// components
import Loader from '../../loader/index.js';

// styles
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import './sidebar.css';

const style = {
  paper: {
    display: 'flex',
    marginTop: '5px',
    marginBottom: '5px',
    marginRight: '5px',
    marginLeft: '5px',
    backgroundColor: 'rgb(54, 58, 66)',
    paddingLeft: '0px',
    paddingRight: '0px'
  },
  relationDesc: {
    fontSize: '12px'
  }
}

const mapStateToProps = store => ({
  tables: store.schema.tables,
  selectedTable: store.schema.selectedTable,
  tableName: store.schema.selectedTable.type,
  tableID: store.schema.selectedTable.tableID,
  database: store.schema.database,
  selectedTable: store.schema.selectedTable,
});

const mapDispatchToProps = dispatch => ({
  tablesToMongoFormat: () => dispatch(actions.tablesToMongoFormat()),
  saveTableDataInput: database => dispatch(actions.saveTableDataInput(database)),
  tableNameChange: tableName => dispatch(actions.handleTableNameChange(tableName)),
  idSelector: () => dispatch(actions.handleTableID()),
  openTableCreator: () => dispatch(actions.openTableCreator()),
  handleSnackbarUpdate: status => dispatch(actions.handleSnackbarUpdate(status)),
});

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
    if (string) {
      const newString = string.replace(' ', '');
      return newString.charAt(0).toUpperCase() + newString.slice(1);
    }
  }

  handleSnackbarUpdate(message) {
    this.props.handleSnackbarUpdate(message);
  }

  saveTableDataInput(e) {
    e.preventDefault();
    let error = false;

    // remove whitespace and symbols
    let name = this.props.selectedTable.type.replace(/[^\w]/gi, '');

    if (name.length > 0) {
      // capitalize first letter
      name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

      // get list of table indexes
      const listTableIndexes = Object.getOwnPropertyNames(this.props.tables);

      // remove the selected table from list of tables if updating to prevent snackbar from displaying table error
      if (this.props.selectedTable.tableID !== -1) {
        listTableIndexes.splice(listTableIndexes.indexOf(String(this.props.selectedTable.tableID)), 1);
      }

      for (let x = 0; x < listTableIndexes.length; x += 1) {
        if (this.props.tables[listTableIndexes[x]].type === name) {
          error = true;
        }
      }

      if (error) {
        this.handleSnackbarUpdate('Error: Table name already exist');
      } else {
        // update table name with uppercase before saving/updating
        this.props.tableNameChange(name);
        this.props.saveTableDataInput();
        this.handleSnackbarUpdate('');
      }
    } else {
      this.handleSnackbarUpdate('Please enter a table name (no symbols or spaces)');
    }
  }

  handleChange(e) {
    this.props.tableNameChange(e.target.value);
  }

  handleCheck() {
    this.props.idSelector()
  }

  handleOpenTableCreator(event) {
    this.props.openTableCreator();
  }

  render() {
    function tableName(tableID, tables) {
      if (tableID >= 0) {
        return <h2>{tables[tableID].type} Table</h2>;
      }
      return <h2>Create Table</h2>;
    }

    return (
      <div id="newTable" key={this.props.tableID}>
        {this.props.tableID >= 0 && (
          <FlatButton
            id="back-to-create"
            label="Create Table"
            icon={<KeyboardArrowLeft />}
            onClick={this.handleOpenTableCreator}
          />
        )}

        <form id="create-table-form" onSubmit={this.saveTableDataInput}>
          {tableName(this.props.tableID, this.props.tables)}

          <TextField
            // hintText="Table Name"
            floatingLabelText="Table Name"
            id="tableName"
            fullWidth={true}
            autoFocus
            onChange={this.handleChange}
            value={this.props.tableName}
          />
          <h5 style={{ textAlign: 'center', marginTop: '-4px' }}>( Singular naming convention )</h5>
          <Checkbox
            style={{ marginTop: '10px' }}
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
            type="submit"
            style={{ marginTop: '25px' }}
          />
        </form>
        <br />
        <br />
        <div>
          <Paper style={style.paper}>
          <List style={{paddingLeft: '18px'}}>
            <ListItem disabled={true} style={{fontSize: '20px'}}><strong>Legend</strong></ListItem>
            <Divider />
            <ListItem disabled={true}>Required : *</ListItem>
            <ListItem disabled={true}>Unique : !</ListItem>
            <ListItem disabled={true}>Multiple Values : [ ]</ListItem>
            <ListItem disabled={true}
              nestedItems={[
                <ListItem disabled={true} style={style.relationDesc}>
                  Diagonal color on field (Name) indicates field is referenced by another field of that same color
                </ListItem>,
                <ListItem disabled={true}>
                  <img src='./../../../../public/images/relation1.png'/>
                </ListItem>,
                <ListItem disabled={true} style={style.relationDesc}>
                  Colored field (AuthorId) indicates it has relation to another field of that same color
                </ListItem>,
                <ListItem disabled={true}>
                  <img src='./../../../../public/images/relation2.png'/>
                </ListItem>
              ]}
            >
              Relation :
            </ListItem>
          </List>

          </Paper>
        </div>
        {/* <div id='loader-container'>
          <Loader/>
        </div> */}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTable);
