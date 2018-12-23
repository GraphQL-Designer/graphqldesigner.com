import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import * as actions from '../../../actions/actions';

// styles
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
    paddingRight: '0px',
  },
  relationDesc: {
    fontSize: '12px',
  },
};

const mapStateToProps = store => ({
  tables: store.schema.tables,
  selectedTable: store.schema.selectedTable,
  tableName: store.schema.selectedTable.type,
  tableID: store.schema.selectedTable.tableID,
  database: store.schema.database,
});

const mapDispatchToProps = dispatch => ({
  saveTableDataInput: database => dispatch(actions.saveTableDataInput(database)),
  tableNameChange: tableName => dispatch(actions.handleTableNameChange(tableName)),
  idSelector: () => dispatch(actions.handleTableID()),
  openTableCreator: () => dispatch(actions.openTableCreator()),
  handleSnackbarUpdate: status => dispatch(actions.handleSnackbarUpdate(status)),
});

const CreateTable = ({
  tables,
  selectedTable,
  tableName,
  tableID,
  database,
  saveTableDataInput,
  tableNameChange,
  idSelector,
  openTableCreator,
  handleSnackbarUpdate
}) => {
  function saveTableData(e) {
    e.preventDefault();

    // remove whitespace and symbols
    let name = selectedTable.type.replace(/[^\w]/gi, '');

    // confirm table name was entered
    if (!name.length) {
      return handleSnackbarUpdate('Please enter a table name (no symbols or spaces)');
    }

    // capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const tableIndices = Object.keys(tables);
    const selectedTableIndex = String(selectedTable.tableID);
    // confirm table name does not exist
    for (let x = 0; x < tableIndices.length; x += 1) {
      const existingTableName = tables[tableIndices[x]].type;
      // if table name is a duplicate (not counting our selected table if updating)
      if (existingTableName === name && tableIndices[x] !== selectedTableIndex) {
        return handleSnackbarUpdate('Error: Table name already exist');
      }
    }

    // update table name with uppercase before saving/updating
    tableNameChange(name);
    return saveTableDataInput();
  }

  function renderTableName() {
    if (tableID >= 0) {
      return <h2>{tables[tableID].type} Table</h2>;
    }
    return <h2>Create Table</h2>;
  }

  return (
    <div id="newTable" key={tableID}>
      {tableID >= 0 && (
        <FlatButton
          id="back-to-create"
          label="Create Table"
          icon={<KeyboardArrowLeft />}
          onClick={openTableCreator}
        />
      )}
      <form id="create-table-form" onSubmit={saveTableData}>
        {renderTableName()}
        <TextField
          floatingLabelText="Table Name"
          id="tableName"
          fullWidth={true}
          autoFocus
          onChange={(e) => tableNameChange(e.target.value)}
          value={tableName}
        />
        <h5 style={{ textAlign: 'center', marginTop: '-4px' }}>( Singular naming convention )</h5>
        <Checkbox
          style={{ marginTop: '10px' }}
          label="Unique ID"
          onCheck={() => idSelector()}
          id="idCheckbox"
          checked={!!selectedTable.fields[0]}
          disabled={database === 'MongoDB'}
        />
        <RaisedButton
          label={tableID >= 0 ? 'Update Table' : 'Create Table'}
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
        <List style={{paddingLeft: "18px"}}>
          <ListItem key="legend" disabled={true} style={{fontSize: "20px"}}><strong>Legend</strong></ListItem>
          <Divider />
          <ListItem key="legend-required" disabled={true}>Required : !</ListItem>
          <ListItem key="unique" disabled={true}>Unique : *</ListItem>
          <ListItem key="multiple-values" disabled={true}>Multiple Values : [ ]</ListItem>
          <ListItem
            key="relation"
            disabled={true}
            nestedItems={[
              <ListItem key="relation-desc1" disabled={true} style={style.relationDesc}>
                Diagonal color on field (Name) indicates field is referenced by another field of that same color
              </ListItem>,
              <ListItem key="relation-pic" disabled={true}>
                <img src="./images/relation1.png" alt="relations" />
              </ListItem>,
              <ListItem key="relation-desc2" disabled={true} style={style.relationDesc}>
                Colored field (AuthorId) indicates it has relation to another field of that same color
              </ListItem>,
              <ListItem key="relation-pic2" disabled={true}>
                <img src="./images/relation2.png" alt="relations" />
              </ListItem>,
            ]}
          >
            Relation :
          </ListItem>
        </List>
        </Paper>
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTable);
