import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions.js';

//styles
import './sidebar.css';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

const style = {
  customWidth: {
    width: 200
  },
  toggle: {
    marginTop: '15px'
  },
};

const mapStateToProps = store => ({
  database: store.general.database,
  tableIndex : store.schema.tableIndexSelected,
  addFieldClicked: store.schema.addFieldClicked,
  selectedField: store.schema.selectedField,
  updatedField: store.schema.fieldUpdated, 
  tables: store.schema.tables,
})

const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(actions.addField(field)),
  saveFieldInput: () => dispatch(actions.saveFieldInput()),
  handleChange: field => dispatch(actions.handleFieldsUpdate(field)),
  openTableCreator: () => dispatch(actions.openTableCreator())
})

class TableOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      selectedTableIndex : null, 
      open: false
    }

    this.submitOptions = this.submitOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleOpenTableCreator = this.handleOpenTableCreator.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleOpenTableCreator(){
    this.props.openTableCreator()
  }

  handleToggle(name, event, value) {
    this.props.handleChange({name: name, value: value})
  };

  handleChange (event) {
    this.props.handleChange({name: event.target.name, value: event.target.value});
  };

  handleSelectChange (name, event, index, value) {
    this.props.handleChange({name: name, value: value});
  };

  submitOptions(event){
    event.preventDefault();
    if(this.props.selectedField.name){
      this.props.saveFieldInput();
    }
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  render() {
    console.log('this is relations', this.props.selectedField.relation)
    console.log('type', this.props.selectedField.relation.type)
    let tables = []
    let fields = [];
    let tempTableNumList = [];

    // Generate relation type options 
    for(let type in this.props.tables){
      if(this.props.selectedField.tableNum !== type){
        tables.push(
          <MenuItem
            key={type}
            value={type} 
            primaryText={this.props.tables[type].type}
          />
        )
        tempTableNumList.push(type);
      }
    }

    // Generate relation field options
    if (Object.keys(this.props.tables).length > 0) {
      
      // iterate through list of types and get type index number matching type in relation selected
      let tempTableNum = Object.keys(this.props.tables)[0]; // start at first table index
      for(let i = 0; i < tempTableNumList.length; i += 1){
        if(this.props.tables[tempTableNumList[i]].type === this.props.selectedField.relation.type){
          tempTableNum = tempTableNumList[i];
        }
      }
      
      //list all of the fields for type selected in relation in sidebar
      for(let field in this.props.tables[tempTableNum].fields){
        fields.push(
          <MenuItem
          key={field}
          value={field} 
          primaryText={this.props.tables[tempTableNum].fields[field].name}
          />
        )
      }
    }
        
    function fieldName(fieldNum, tableNum, tables) {
      if (fieldNum >= 0) {
        return (
        <div style={{marginTop: '10px'}}>
          <h2>{tables[tableNum].fields[fieldNum].name} Field</h2>
          <h4 style={{fontWeight: '200', marginTop: '5px'}}>in {tables[tableNum].type}</h4>
        </div>
        )
      }
      return (
        <div style={{marginTop: '10px'}}>
          <h2>Add Field</h2>
          <h4 style={{fontWeight: '200', marginTop: '5px'}}>to {tables[tableNum].type}</h4>
        </div>
      )
    }

    return (
      <div id='fieldOptions'> 
        { this.props.selectedField.tableNum > -1  &&
        <div id='options' style={{width: '250px'}}>
          <FlatButton
            id='back-to-create'
            label="Create Table"
            icon={<KeyboardArrowLeft />}
            onClick={this.handleOpenTableCreator}
          />
          <form style={{width: '100%'}}>
          {fieldName(this.props.selectedField.fieldNum, this.props.selectedField.tableNum, this.props.tables)}

            <TextField
              hintText="Field Name"
              floatingLabelText="Field Name"
              fullWidth={true}
              name='name' 
              id='fieldNameOption' 
              onChange={this.handleChange} 
              value={this.props.selectedField.name}
              autoFocus
            />

            <TextField
              hintText="Default Value"
              floatingLabelText="Default Value"
              fullWidth={true}
              id='defaultValueOption'
              name='defaultValue' 
              onChange={this.handleChange}
              value={this.props.selectedField.defaultValue} 
              />

            <SelectField
              floatingLabelText="Type"
              fullWidth={true}
              value={this.props.selectedField.type}
              onChange={this.handleSelectChange.bind(null, 'type')} // we access 'type' as name in handleChange
            >
              <MenuItem value='String' primaryText="String" />
              <MenuItem value='Number' primaryText="Number" />
              <MenuItem value='Boolean' primaryText="Boolean" />
              <MenuItem value='ID' primaryText="ID" />
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
              toggled={this.props.selectedField.multipleValues}
              onToggle={this.handleToggle.bind(null, 'multipleValues')}
              style={style.toggle}
            />

             <Toggle
              label="Relation"
              toggled={this.props.selectedField.relationSelected}
              onToggle={this.handleToggle.bind(null, 'relationSelected')}
              style={style.toggle}
            />
            
              {this.props.selectedField.relationSelected && (<span>
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
                label={this.props.selectedField.fieldNum > -1 ?'Update Field' : 'Create Field'}
                type='submit'
                onClick={this.submitOptions}
                style={{marginTop: '25px'}}
              />
          </form>
          <div style={{width: '100%', height: '40px'}}/>
        </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableOptions);