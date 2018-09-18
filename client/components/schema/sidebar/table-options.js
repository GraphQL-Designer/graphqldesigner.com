import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import * as actions from '../../../actions/actions.js';
// import { MenuItem, DropdownButton } from 'react-bootstrap';

import './sidebar.css';

const mapStateToProps = store => ({
  database: store.data.database,
  tableIndex : store.data.tableIndexSelected,
  addFieldClicked: store.data.addFieldClicked,
  selectedField: store.data.selectedField,
  updatedField: store.data.fieldUpdated, 
})

const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(actions.addField(field)),
  updateField: () => dispatch(actions.updateField()),
  handleChange: field => dispatch(actions.handleFieldsUpdate(field))
})

class TableOptions extends React.Component {
  constructor(props) {
    super(props);

    this.submitOptions = this.submitOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleToggle () {this.setState({open: !this.state.open})};

  handleChange (event) {
    this.props.handleChange({name: event.target.name, value: event.target.value});
    
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
    // let fieldName = document.getElementById('fieldNameOption').value;
    
    if(this.props.selectedField.name){
      // const options = {
      //   name: document.getElementById('fieldNameOption').value,
      //   type: document.getElementById('typeDropDown').value,
      //   primaryKey: document.getElementById('primaryKeyDropDown').value,
      //   unique: document.getElementById('uniqueDropDown').value,
      //   defaultValue: document.getElementById('defaultValueOption').value,
      //   multipleValues: document.getElementById('multipleValuesDropDown').value,
      //   required: document.getElementById('requiredDropDown').value,
      //   relations: document.getElementById('relationDropDown').value
      // }
  
      //
      // if(Object.keys(this.props.selectedField).length){
      //   options.tableIndex = this.props.selectedField.tableIndex;
      //   options.fieldIndex = this.props.selectedField.fieldIndex;
      //   options.submitUpdate = true;
      //   this.props.updateField(options);
      // } else{
      //   this.props.createField(options);
      // }
      this.props.updateField();
    }
    
  }

  render() {

    return (
      <div>
        { this.props.selectedField.tableNum > -1  &&
        <div id='options'>
          <h4>Options</h4>
          <form>
              <span>
                  Field Name : <input 
                                    onChange={this.handleChange} 
                                    id='fieldNameOption' 
                                    type='text' 
                                    name='name' 
                                    value={this.props.selectedField.name}
                                    autoFocus
                                />
              </span>

              <span>Type : 
                <select onChange={this.handleChange} id="typeDropDown" name='type' value={this.props.selectedField.type}>
                  <option value="String">String</option>
                  <option value="Number">Number</option>
                  <option value="Date">Date</option>
                  <option value="Boolean">Boolean</option>
                  <option value="ID">ID</option>
                </select>
              </span>

              {this.props.database === 'SQL' && (<span> Primary Key :
                <select onChange={this.handleChange} id="primaryKeyDropDown" name='primaryKey' value={this.props.selectedField.primaryKey}>
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>)}


              <span>Unique : 
                <select onChange={this.handleChange} id="uniqueDropDown" name='unique' value={this.props.selectedField.unique}>
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>
              <span>
                  Default Value : <input onChange={this.handleChange} id='defaultValueOption' type='text' name='defaultValue' value={this.props.selectedField.defaultValue} />
              </span>

              <span>Required : 
                <select onChange={this.handleChange} id="requiredDropDown" name='required' value={this.props.selectedField.required}>
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>

              <span>Multiple Values : 
                <select onChange={this.handleChange} id="multipleValuesDropDown" name='multipleValues' value={this.props.selectedField.multipleValues}>
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>

              <span>Relation : 
                <select onChange={this.handleChange} id="relationDropDown" name='relations' value={this.props.selectedField.relations}>
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>
              <button onClick={this.submitOptions} className='btn btn-success'>
                {this.props.selectedField.fieldNum > -1 ?'Update Field' : 'Create Field'}
              </button>
          </form>
        </div>
        }
        

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableOptions);