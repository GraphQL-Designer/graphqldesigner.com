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
  database: store.general.database,
  // tableIndex: store.schema.tableIndexSelected,
  addFieldClicked: store.schema.addFieldClicked,
  selectedField: store.schema.selectedField,
  updatedField: store.schema.fieldUpdated,
  tables: store.schema.tables,
});

const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(actions.addField(field)),
  saveFieldInput: database => dispatch(actions.saveFieldInput(database)),
  handleChange: field => dispatch(actions.handleFieldsUpdate(field)),
  openTableCreator: () => dispatch(actions.openTableCreator()),
  handleSnackbarUpdate: status => dispatch(actions.handleSnackbarUpdate(status)),
});

class TableOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTableIndex: null,
      open: false,
    };

    this.submitOptions = this.submitOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleOpenTableCreator = this.handleOpenTableCreator.bind(this);
    this.handleSnackbarUpdate = this.handleSnackbarUpdate.bind(this);
  }

  handleOpenTableCreator() {
    this.props.openTableCreator();
  }

  handleToggle(name, event, value) {
    this.props.handleChange({ name: name, value: value });
  }

  handleChange(event) {
    this.props.handleChange({
      name: event.target.name,
      value: event.target.value,
    });
  }

  handleSelectChange(name, event, index, value) {
    this.props.handleChange({ name: name, value: value });
  }

  handleSnackbarUpdate(message) {
    this.props.handleSnackbarUpdate(message);
  }

  submitOptions(event) {
    event.preventDefault();

    let error = false;
    let currTableNum = this.props.selectedField.tableNum;

    // remove whitespace and symbols
    const originalFieldName = this.props.selectedField.name;
    const newFieldName = this.props.selectedField.name.replace(/[^\w]/gi, '');

    if (newFieldName.length > 0) {
      // get list of field indexes
      const listFieldIndexes = Object.keys(this.props.tables[currTableNum].fields);
      const selectedFieldIndex = this.props.selectedField.fieldNum;

      // remove the selected field from list of tables if updating to prevent snackbar from displaying table error
      if (selectedFieldIndex !== -1) {
        listFieldIndexes.splice(listFieldIndexes.indexOf(String(selectedFieldIndex)), 1);
      }

      // if there are at least 1 field, check if there's duplicate in the list of fields in the table
      for (let x = 0; x < listFieldIndexes.length; x += 1) {
        if (this.props.tables[currTableNum].fields[listFieldIndexes[x]].name === newFieldName) {
          error = true;
        }
      }

      if (error) {
        this.handleSnackbarUpdate('Error: Field name already exist');
      }
      // check relation conditions
      else {
        if (this.props.selectedField.relationSelected) {
          // check if Type, Field, and RefType are selected if Relation is toggled
          if (this.props.selectedField.relation.tableIndex === -1 || this.props.selectedField.relation.fieldIndex === -1 || !this.props.selectedField.relation.refType) {
            return this.handleSnackbarUpdate('Please fill out Type, Field, and RefType in Relation');
          }
        }
        // update state if field name was modified to take out spaces and symbols. 
        if (originalFieldName !== newFieldName) {
          this.handleSnackbarUpdate('Spaces or symbols were removed from field name');
          this.props.handleChange({
            name: 'name',
            value: newFieldName,
          });
        }
        // save or update table
        this.props.saveFieldInput();
      }
    } else {
      this.handleSnackbarUpdate('Please enter a field name (no space, symbols allowed)');
    }
  }
  render() {
    console.log('tables', this.props.tables)
    let tables = [];
    let fields = [];

    // Generate relation type options
    for (let types in this.props.tables) {
      tables.push(
        <MenuItem
          key={types}
          value={types}
          primaryText={this.props.tables[types].type}
        />,
      )
    }

    const selectedTableIndex = this.props.selectedField.relation.tableIndex
    if (selectedTableIndex >= 0) {
      for (let field in this.props.tables[selectedTableIndex].fields) {
        // check if field has a relation to selected field, if so, don't push
        let noRelationExists = true; 
        const tableIndex = this.props.selectedField.tableNum
        let fieldIndex = this.props.selectedField.fieldNum
        if (fieldIndex >= 0) {
          const refBy = this.props.tables[tableIndex].fields[fieldIndex].refBy
          if (refBy.size > 0) {
            const refTypes = ['one to one', 'one to many', 'many to one', 'many to many']
            for (let i = 0; i < refTypes.length; i += 1) {
              const refInfo = `${selectedTableIndex}.${field}.${refTypes[i]}`
              if (refBy.has(refInfo)) {
                noRelationExists = false; 
              }
            }
          }
        }
        // only push to fields if multiple values is false for the field,
        // and no relation exists to selected field
        if (!this.props.tables[selectedTableIndex].fields[field].multipleValues && noRelationExists) {
          fields.push(
            <MenuItem
              key={field}
              value={field}
              primaryText={this.props.tables[selectedTableIndex].fields[field].name}
            />,
          );
        }
      }
    }

    function fieldName(fieldNum, tableNum, tables) {
      // Header text if adding a new field
      let h2Text = 'Add Field'
      let h4Text = `in ${tables[tableNum].type}`
      // Header text if updating a field
      if (fieldNum >= 0) {
        h2Text = `Update ${tables[tableNum].fields[fieldNum].name}`
        h4Text = `in ${tables[tableNum].type}`
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
        {this.props.selectedField.tableNum > -1 && (
          <div id="options" style={{ width: '250px' }}>
            <FlatButton
              id="back-to-create"
              label="Create Table"
              icon={<KeyboardArrowLeft />}
              onClick={this.handleOpenTableCreator}
            />
            <form style={{ width: '100%' }}>
              {fieldName(
                this.props.selectedField.fieldNum,
                this.props.selectedField.tableNum,
                this.props.tables,
              )}

              <TextField
                hintText="Field Name"
                floatingLabelText="Field Name"
                fullWidth={true}
                name="name"
                id="fieldNameOption"
                onChange={this.handleChange}
                value={this.props.selectedField.name}
                autoFocus
              />

              <TextField
                hintText="Default Value"
                floatingLabelText="Default Value"
                fullWidth={true}
                id="defaultValueOption"
                name="defaultValue"
                onChange={this.handleChange}
                value={this.props.selectedField.defaultValue}
              />

              <SelectField
                floatingLabelText="Type"
                fullWidth={true}
                value={this.props.selectedField.type}
                onChange={this.handleSelectChange.bind(null, 'type')} // we access 'type' as name in handleChange
              >
                <MenuItem value="String" primaryText="String" />
                <MenuItem value="Number" primaryText="Number" />
                <MenuItem value="Boolean" primaryText="Boolean" />
                <MenuItem value="ID" primaryText="ID" />
              </SelectField>

              {this.props.database === 'SQL' && (
                <Toggle
                  label="Primary Key"
                  toggled={this.props.selectedField.primaryKey}
                  onToggle={this.handleToggle.bind(null, 'primaryKey')}
                  style={style.toggle}
                />
              )}

              <Toggle
                label="Required"
                toggled={this.props.selectedField.required}
                onToggle={this.handleToggle.bind(null, 'required')}
                style={style.toggle}
              />

              <Toggle
                label="Unique"
                toggled={this.props.selectedField.unique}
                onToggle={this.handleToggle.bind(null, 'unique')}
                style={style.toggle}
              />

              <Toggle
                label="Multiple Values"
                toggled={this.props.selectedField.multipleValues && !this.props.selectedField.relationSelected}
                onToggle={this.handleToggle.bind(null, 'multipleValues')}
                style={style.toggle}
                disabled={this.props.selectedField.relationSelected || this.props.selectedField.refBy.size > 0}
              />

              <Toggle
                label="Relation"
                toggled={this.props.selectedField.relationSelected && !this.props.selectedField.multipleValues}
                onToggle={this.handleToggle.bind(null, 'relationSelected')}
                style={style.toggle}
                disabled={this.props.selectedField.multipleValues}
              />

              {this.props.selectedField.relationSelected && !this.props.selectedField.multipleValues && (<span>
                <div className='relation-options'>
                  <p>Type:</p>
                  <DropDownMenu
                    value={this.props.selectedField.relation.tableIndex}
                    style={style.customWidth}
                    onChange={this.handleSelectChange.bind(null, 'relation.tableIndex')} // access 'relation.type' as name in handleChange
                  >
                    {tables}
                  </DropDownMenu>
                </div>

                <div className='relation-options'>
                  <p>Field:</p>
                  <DropDownMenu
                    value={this.props.selectedField.relation.fieldIndex}
                    style={style.customWidth}
                    onChange={this.handleSelectChange.bind(null, 'relation.fieldIndex')} // access 'relation.field' as name in handleChange
                  >
                    {fields}
                  </DropDownMenu>
                </div>

                <div className='relation-options'>
                  <p>RefType:</p>
                  <DropDownMenu
                    value={this.props.selectedField.relation.refType}
                    style={style.customWidth}
                    onChange={this.handleSelectChange.bind(null, 'relation.refType')} // access 'relation.refType' as name in handleChange
                  >
                    <MenuItem value='one to one' primaryText="one to one" />
                    <MenuItem value='one to many' primaryText="one to many" />
                    <MenuItem value='many to one' primaryText="many to one" />
                    <MenuItem value='many to many' primaryText="many to many" />
                  </DropDownMenu>
                </div>
              </span>)}
              <RaisedButton
                secondary={true}
                label={this.props.selectedField.fieldNum > -1 ? 'Update Field' : 'Create Field'}
                type="submit"
                onClick={this.submitOptions}
                style={{ marginTop: '25px' }}
              />
            </form>
            <div style={{ width: '100%', height: '40px' }} />
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableOptions);
