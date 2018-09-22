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
import Snackbar from 'material-ui/Snackbar';
const style = {
  customWidth: {
    width: 200,
  },
  snackBarStyle: {
    backgroundColor: 'rgb(255,66,128)',
    color: 'black'
  }
};

const mapStateToProps = store => ({
  database: store.data.database,
  tableIndex : store.data.tableIndexSelected,
  addFieldClicked: store.data.addFieldClicked,
  selectedField: store.data.selectedField,
  updatedField: store.data.fieldUpdated, 
  tables: store.data.tables,
  inputError: store.data.inputError
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

    // this.showRelations = this.showRelations.bind(this)
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

  // showRelations(event, value){
  //   console.log(value)
  //   if (value) this.setState({showRelations: true})
  //   else this.setState({showRelations: false})
  // }

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
    // this.setState({showRelations: false})
    if(this.props.selectedField.name){
      this.props.saveFieldInput();

      // check if entered input already exists in the table to trigger snackbar to display error
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
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  render() {
    console.log('yooo: ', this.props.tables[this.props.selectedField.tableNum]);
    let tables = []
    let fields = [];
    let tempTableNumList = [];

    // Generate relation type options 
    for(let types in this.props.tables){
      if(this.props.selectedField.tableNum !== types){
        // tables.push(<option key={types} value={this.props.tables[types].tableID.type}>{this.props.tables[types].type}</option>);
        tables.push(
          <MenuItem
            key={types}
            value={this.props.tables[types].type} 
            primaryText={this.props.tables[types].type}
          />
        )
        tempTableNumList.push(types);
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
        console.log('fields', field)
        fields.push(
          <MenuItem
          key={field}
          value={this.props.tables[tempTableNum].fields[field].name} 
          primaryText={this.props.tables[tempTableNum].fields[field].name}
          />
        )
      }
    }
        
    function fieldName(fieldNum, tableNum, tables) {
      if (fieldNum >= 0) {
        return (
        <div>
          <h2 className="field-option-header">{tables[tableNum].fields[fieldNum].name} Field</h2>
          <h4 className="field-option-header">in {tables[tableNum].type}</h4>
        </div>
        )
      }
      return (
        <div>
          <h2 className="field-option-header">Add Field</h2>
          <h4 className="field-option-header">to Table {tables[tableNum].type}</h4>
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
            />
            )}
            
            <Toggle
              label="Required"
              toggled={this.props.selectedField.required}
              onToggle={this.handleToggle.bind(null, 'required')}
            />

            <Toggle
              label="Unique"
              toggled={this.props.selectedField.unique}
              onToggle={this.handleToggle.bind(null, 'unique')}
            />

            <Toggle
              label="Multiple Values"
              toggled={this.props.selectedField.multipleValues}
              onToggle={this.handleToggle.bind(null, 'multipleValues')}
            />

             <Toggle
              label="Relation"
              toggled={this.props.selectedField.relationSelected}
              onToggle={this.handleToggle.bind(null, 'relationSelected')}
            />
            
              {this.props.selectedField.relationSelected && (<span>
                <div className='relation-options'>
                  <p>Type:</p>
                  <DropDownMenu
                    value={this.props.selectedField.relation.type}
                    style={style.customWidth}
                    onChange={this.handleSelectChange.bind(null, 'relation.type')} // access 'relation.type' as name in handleChange
                    >
                      {tables}
                  </DropDownMenu> 
                </div>

                <div className='relation-options'>
                  <p>Field:</p>
                  <DropDownMenu
                    value={this.props.selectedField.relation.field}
                    style={style.customWidth}
                    onChange={this.handleSelectChange.bind(null, 'relation.field')} // access 'relation.field' as name in handleChange
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
              />
          </form>
        </div>
        }
        <Snackbar
          open={this.state.open}
          // message={this.props.inputError.dupField + ' in Table ' + this.props.tables[this.props.selectedField.tableNum].type}
          message={this.props.inputError.dupField}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
          bodyStyle={style.snackBarStyle}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableOptions);