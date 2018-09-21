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
const styles = {
  customWidth: {
    width: 150,
  },
};

const mapStateToProps = store => ({
  database: store.data.database,
  tableIndex : store.data.tableIndexSelected,
  addFieldClicked: store.data.addFieldClicked,
  selectedField: store.data.selectedField,
  updatedField: store.data.fieldUpdated, 
  tableCount: store.data.tableCount,
  tables: store.data.tables
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
      selectedTableIndex : null
    }

    this.submitOptions = this.submitOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMaterialChange = this.handleMaterialChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this)
    this.handleOpenTableCreator = this.handleOpenTableCreator.bind(this)
  }

  handleToggle(name, event, value) {
    this.props.handleChange({name: name, value: value})
  };

  handleChange (event) {
    this.props.handleChange({name: event.target.name, value: event.target.value});
  };

  handleMaterialChange (name, event, index, value) {
    this.props.handleChange({name: name, value: value});
  };

  handleNullChange (event, index, nullValue) {
    event.preventDefault();
    this.setState({nullValue});
  };

  handleUniqueChange (event, index, uniqueValue) {
    event.preventDefault();
    this.setState({uniqueValue});
  };

  submitOptions(event){
    event.preventDefault();
    if(this.props.selectedField.name){
      this.props.saveFieldInput();
    }
  }

  handleOpenTableCreator(event){
    this.props.openTableCreator()
  }

  render() {
    // create option with default of empty string when viewed
    // let tables = [<option key='empty'> </option>];
    let tables = []
    let fields = [];
    // let fields = [<option key='empty'> </option>];

    let tempTableNumList = [];

    // Generate relation type options if there is more than one type
    if(this.props.tableCount > 1){
      for(let types in this.props.tables){
        if(this.props.selectedField.tableNum !== types){
          // tables.push(<option key={types} value={this.props.tables[types].tableID.type}>{this.props.tables[types].type}</option>);
          tables.push(
            <MenuItem
              key={types}
              value={this.props.tables[types].tableID.type} 
              primaryText={this.props.tables[types].type}
            />
          )
          tempTableNumList.push(types);
        }
      }
      let tempTableNum = 0;
      // iterate through list of types and get type index number matching type in relation selected
      for(let x = 0; x < tempTableNumList.length; x += 1){
        if(this.props.tables[tempTableNumList[x]].type === this.props.selectedField.relation.type){
          tempTableNum = tempTableNumList[x];
        }
      }
      
      // list all of the fields for type selected in relation in sidebar
      for(let field in this.props.tables[tempTableNum].fields){
        // fields.push(<option key={field} value={this.props.tables[tempTableNum].fields[field].name}>{this.props.tables[tempTableNum].fields[field].name}</option>)
        fields.push(
        // <option key={field} value={this.props.tables[tempTableNum].fields[field].name}>
        // {/* {this.props.tables[tempTableNum].fields[field].name}</option> */}
          <MenuItem
            key={field}
            value={this.props.tables[tempTableNum].fields[field].name} 
            primaryText={this.props.tables[tempTableNum].fields[field].name}
          />
        )
      
      }
    }

    return (
      <div id='fieldOptions'> 
        { this.props.selectedField.tableNum > -1  &&
        <div id='options'>
          <FlatButton
            id='back-to-create'
            label="Create Table"
            icon={<KeyboardArrowLeft />}
            onClick={this.handleOpenTableCreator}
          />
          <form>
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
              fullWidth="true"
              value={this.props.selectedField.type}
              onChange={this.handleMaterialChange.bind(null, 'type')} // we access 'type' as name in handleChange
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

              {/* {this.props.tableCount > 1 && (<span> */}
            
              {Object.keys(this.props.tables).length > 1 && (<span>
                <p>Relation : </p>
                <div className='relation-options'>

                <p>Type:</p>
                <DropDownMenu
                  // floatingLabelText="Type:"
                  // style={styles.customWidth}
                  // autoWidth={false}
                  value={this.props.selectedField.relation.type}
                  onChange={this.handleMaterialChange.bind(null, 'relation.type')} // access 'relation.type' as name in handleChange
                  >
                  {tables}
                </DropDownMenu> 
                </div>
                {/* <p>Type:
                  <select onChange={this.handleChange} id="relationTypeDropDown" name='relation.type' value={this.props.selectedField.relation.type}>
                    {tables}
                  </select>
                </p>
                  <select onChange={this.handleChange} id="relationFieldDropDown" name='relation.field' value={this.props.selectedField.relation.field}>
                    {fields}
                  </select> */}
                  <div className='relation-options'>
                  <p>Field:</p>
                  <DropDownMenu
                  // floatingLabelText="Field:"
                  value={this.props.selectedField.relation.field}
                  onChange={this.handleMaterialChange.bind(null, 'relation.field')} // access 'relation.field' as name in handleChange
                >
                  {fields}
                </DropDownMenu> 
                </div>
                <div className='relation-options'>

                <p>RefType:
                  {/* <select onChange={this.handleChange} id="relationRefTypeDropDown" name='relation.refType' value={this.props.selectedField.relation.refType}>
                    <option value="one to one">one to one</option>
                    <option value="one to many">one to many</option>
                  </select> */}
                </p>
                <DropDownMenu
                  value={this.props.selectedField.relation.refType}
                  onChange={this.handleMaterialChange.bind(null, 'relation.refType')} // access 'relation.refType' as name in handleChange
                >
                  <MenuItem value='one to one' primaryText="one to one" />
                  <MenuItem value='one to many' primaryText="one to many" />
                </DropDownMenu> 
                {/* </p> */}
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
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableOptions);