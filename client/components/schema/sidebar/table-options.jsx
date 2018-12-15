import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions.js';

// styles
import './sidebar.css';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

const style = {
  customWidth: {
    width: 200,
  },
  toggle: {
    marginTop: '5px',
  },
};

const mapStateToProps = store => ({
  database: store.schema.database,
  selectedField: store.schema.selectedField,
  tables: store.schema.tables,
});

const mapDispatchToProps = dispatch => ({
  // createField: field => dispatch(actions.addField(field)),
  saveFieldInput: database => dispatch(actions.saveFieldInput(database)),
  handleChange: field => dispatch(actions.handleFieldsUpdate(field)),
  openTableCreator: () => dispatch(actions.openTableCreator()),
  handleSnackbarUpdate: status => dispatch(actions.handleSnackbarUpdate(status)),
});

const TableOptions = ({
  database,
  selectedField,
  tables,
  saveFieldInput,
  handleChange,
  openTableCreator,
  handleSnackbarUpdate,
}) => {

  function handleOpenTableCreator() {
    openTableCreator();
  }

  function handleToggle(name, event, value) {
    handleChange({ name: name, value: value });

    // set required to true and disabled if primary key is selected for SQL
    if (database !== 'MongoDB' && name === 'primaryKey' && value === true) {
      handleChange({ name: 'required', value: true });
    }
  }

  function handleChange(event) {
    handleChange({
      name: event.target.name,
      value: event.target.value,
    });
  }

  function handleSelectChange(name, event, index, value) {
    handleChange({ name: name, value: value });
  }

  function handleSnackbarUpdate(message) {
    handleSnackbarUpdate(message);
  }

  function submitOptions(event) {
    event.preventDefault();

    let error = false;
    let currTableNum = selectedField.tableNum;

    // remove whitespace and symbols
    const originalFieldName = selectedField.name;
    const newFieldName = selectedField.name.replace(/[^\w]/gi, '');

    if (newFieldName.length > 0) {
      // get list of field indexes
      const listFieldIndexes = Object.keys(tables[currTableNum].fields);
      const selectedFieldIndex = selectedField.fieldNum;

      // remove the selected field from list of tables if updating to prevent snackbar from displaying table error
      if (selectedFieldIndex !== -1) {
        listFieldIndexes.splice(listFieldIndexes.indexOf(String(selectedFieldIndex)), 1);
      }

      // if there are at least 1 field, check if there's duplicate in the list of fields in the table
      for (let x = 0; x < listFieldIndexes.length; x += 1) {
        if (tables[currTableNum].fields[listFieldIndexes[x]].name === newFieldName) {
          error = true;
        }
      }

      if (error) {
        handleSnackbarUpdate('Error: Field name already exist');
      }
      // check relation conditions
      else {
        if (selectedField.relationSelected) {
          // check if Type, Field, and RefType are selected if Relation is toggled
          let relationNotFilled;
          let message;
          if (database === 'MongoDB') {
            relationNotFilled = selectedField.relation.tableIndex === -1 || selectedField.relation.fieldIndex === -1 || !selectedField.relation.refType;
            message = 'Please fill out Type, Field, and RefType in Relation';
          } else {
            relationNotFilled = selectedField.relation.tableIndex === -1 || selectedField.relation.fieldIndex === -1;
            message = 'Please fill out Type and Field in Foreign Key';
          }
          if (relationNotFilled) {
            return handleSnackbarUpdate(message);
          }
        }
        // update state if field name was modified to take out spaces and symbols.
        if (originalFieldName !== newFieldName) {
          handleSnackbarUpdate('Spaces or symbols were removed from field name');
          handleChange({
            name: 'name',
            value: newFieldName,
          });
        }
        // save or update table
        saveFieldInput();
      }
    } else {
      handleSnackbarUpdate('Please enter a field name (no space, symbols allowed)');
    }
  }

  let renderedTables = [];
  let renderedFields = [];

  // Generate relation type options
  for (let types in tables) {
      renderedTables.push(
        <MenuItem
          key={types}
          value={types}
          primaryText={tables[types].type}
        />,
      );
  }

  const selectedTableIndex = selectedField.relation.tableIndex;
  if (selectedTableIndex >= 0) {
      for (let field in tables[selectedTableIndex].fields) {
        // check if field has a relation to selected field, if so, don't push
        let noRelationExists = true;
        const tableIndex = selectedField.tableNum;
        let fieldIndex = selectedField.fieldNum;
        if (fieldIndex >= 0) {
          const refBy = tables[tableIndex].fields[fieldIndex].refBy;
          if (refBy.size > 0) {
            const refTypes = ['one to one', 'one to many', 'many to one', 'many to many'];
            for (let i = 0; i < refTypes.length; i += 1) {
              const refInfo = `${selectedTableIndex}.${field}.${refTypes[i]}`;
              if (refBy.has(refInfo)) {
                noRelationExists = false;
              }
            }
          }
        }
        // only push to fields if multiple values is false for the field,
        // and no relation exists to selected field
        if (!tables[selectedTableIndex].fields[field].multipleValues && noRelationExists) {
          renderedFields.push(
            <MenuItem
              key={field}
              value={field}
              primaryText={tables[selectedTableIndex].fields[field].name}
            />,
          );
        }
      }
  }

  function fieldName(fieldNum, tableNum, tables) {
      // Header text if adding a new field
      let h2Text = 'Add Field';
      let h4Text = `in ${tables[tableNum].type}`;
      // Header text if updating a field
      if (fieldNum >= 0) {
        h2Text = `Update ${tables[tableNum].fields[fieldNum].name}`;
        h4Text = `in ${tables[tableNum].type}`;
      }
      return (
        <div style={{ marginTop: '10px' }}>
          <h2>{h2Text}</h2>
          <h4 style={{ fontWeight: '200', marginTop: '5px' }}>{h4Text}</h4>
        </div>
      );
  }

  return (
    <div id="fieldOptions">
        {selectedField.tableNum > -1 && (
          <div id="options" style={{ width: '250px' }}>
            <FlatButton
              id="back-to-create"
              label="Create Table"
              icon={<KeyboardArrowLeft />}
              onClick={handleOpenTableCreator}
            />
            <form style={{ width: '100%' }}>
              {fieldName(
                selectedField.fieldNum,
                selectedField.tableNum,
                tables,
              )}

              <TextField
                hintText="Field Name"
                floatingLabelText="Field Name"
                fullWidth={true}
                name="name"
                id="fieldNameOption"
                onChange={handleChange}
                value={selectedField.name}
                autoFocus
              />

              <SelectField
                floatingLabelText="Type"
                fullWidth={true}
                value={selectedField.type}
                onChange={handleSelectChange.bind(null, 'type')} // we access 'type' as name in handleChange
              >
                <MenuItem value="String" primaryText="String" />
                <MenuItem value="Number" primaryText="Number" />
                <MenuItem value="Boolean" primaryText="Boolean" />
                <MenuItem value="ID" primaryText="ID" />
              </SelectField>
              
              <TextField
                hintText="Default Value"
                floatingLabelText="Default Value"
                fullWidth={true}
                id="defaultValueOption"
                name="defaultValue"
                onChange={handleChange}
                value={selectedField.defaultValue}
              />

              {database !== 'MongoDB' && (
                <Toggle
                  label="Primary Key"
                  toggled={selectedField.primaryKey}
                  onToggle={handleToggle.bind(null, 'primaryKey')}
                  style={style.toggle}
                />
              )}

              <Toggle
                label="Required"
                toggled={selectedField.required}
                onToggle={handleToggle.bind(null, 'required')}
                style={style.toggle}
                disabled={selectedField.primaryKey}
              />

              <Toggle
                label="Unique"
                toggled={selectedField.unique}
                onToggle={handleToggle.bind(null, 'unique')}
                style={style.toggle}
              />

              {database !== 'MongoDB' && (
                <Toggle
                  label="Auto Increment"
                  toggled={selectedField.autoIncrement}
                  onToggle={handleToggle.bind(null, 'autoIncrement')}
                  style={style.toggle}
                />
              )}

              {database === 'MongoDB' && (
                <Toggle
                  label="Multiple Values"
                  toggled={selectedField.multipleValues && !selectedField.relationSelected}
                  onToggle={handleToggle.bind(null, 'multipleValues')}
                  style={style.toggle}
                  disabled={selectedField.relationSelected || selectedField.refBy.size > 0}
                />
              )}

              <Toggle
                label={database === 'MongoDB' ? 'Relation' : 'Foreign Key'}
                toggled={selectedField.relationSelected && !selectedField.multipleValues}
                onToggle={handleToggle.bind(null, 'relationSelected')}
                style={style.toggle}
                disabled={selectedField.multipleValues}
              />

              {selectedField.relationSelected && !selectedField.multipleValues && (<span>
                <div className='relation-options'>
                  <p>Type:</p>
                  <DropDownMenu
                    value={selectedField.relation.tableIndex}
                    style={style.customWidth}
                    onChange={handleSelectChange.bind(null, 'relation.tableIndex')} // access 'relation.type' as name in handleChange
                  >
                    {tables}
                  </DropDownMenu>
                </div>

                <div className='relation-options'>
                  <p>Field:</p>
                  <DropDownMenu
                    value={selectedField.relation.fieldIndex}
                    style={style.customWidth}
                    onChange={handleSelectChange.bind(null, 'relation.fieldIndex')} // access 'relation.field' as name in handleChange
                  >
                    {fields}
                  </DropDownMenu>
                </div>

                <div className='relation-options'>
                  <p>RefType:</p>
                  <DropDownMenu
                    value={selectedField.relation.refType}
                    style={style.customWidth}
                    onChange={handleSelectChange.bind(null, 'relation.refType')} // access 'relation.refType' as name in handleChange
                  >
                    <MenuItem value='one to one' primaryText="one to one" />
                    <MenuItem value='one to many' primaryText="one to many" />
                    <MenuItem value='many to one' primaryText="many to one" />
                    {/* <MenuItem value='many to many' primaryText="many to many" /> */}
                  </DropDownMenu>
                </div>
              </span>)}
              <RaisedButton
                secondary={true}
                label={selectedField.fieldNum > -1 ? 'Update Field' : 'Create Field'}
                type="submit"
                onClick={submitOptions}
                style={{ marginTop: '25px' }}
              />
            </form>
          </div>
        )}
      </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableOptions);
