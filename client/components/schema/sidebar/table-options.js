import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import * as actions from '../../../actions/actions.js';
// import { MenuItem, DropdownButton } from 'react-bootstrap';

import './sidebar.css';

const mapStateToProps = store => ({
  // tables: store.data.tables, 
  // tableIndex: store.data.tableIndex,
  // // Need below to subscribe to store. store.data.tables is an object so never changes
  // tableCount: store.data.tableCount,
  tableIndex : store.data.tableIndexSelected,
  addFieldClicked: store.data.addFieldClicked,
  selectedField: store.data.selectedField
})

const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(actions.addField(field)),
  updateField: field => dispatch(actions.updateField(field))
})

class TableOptions extends React.Component {
  constructor(props) {
    super(props);

    this.submitOptions = this.submitOptions.bind(this);
    this.populateSelected = this.populateSelected.bind(this);
  }

  handleToggle () {this.setState({open: !this.state.open})};

  handleChange (event, index, typeValue) {
    event.preventDefault();
    this.setState({typeValue});
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
    let fieldName = document.getElementById('fieldNameOption').value;
    
    if(fieldName.length !== 0){
      const options = {
        name: document.getElementById('fieldNameOption').value,
        type: document.getElementById('typeDropDown').value,
        primaryKey: document.getElementById('primaryKeyDropDown').value,
        unique: document.getElementById('uniqueDropDown').value,
        defaultValue: document.getElementById('defaultValueOption').value,
        multipleValues: document.getElementById('defaultValueOption').value,
        required: document.getElementById('requiredDropDown').value,
        relation: document.getElementById('relationDropDown').value
      }
  
      console.log('options: ', options);

      if(Object.keys(this.props.selectedField).length){
        console.log('we are updating the following options: ', options);
        options.tableIndex = this.props.selectedField.tableIndex;
        options.fieldIndex = this.props.selectedField.fieldIndex;
        options.submitUpdate = true;
        this.props.updateField(options);
      } else{
        this.props.createField(options);
      }
    }
    
  }

  updateOption(event){
    event.preventDefault();
    this.props.updateField({
      tableIndex : this.props.selectedField.tableIndex,
      fieldIndex : this.props.selectedField.fieldIndex
    })
  }

  populateSelected = function () {
    console.log('in function populatedSelected');
    console.log(this.props.selectedField);
    if(this.props.selectedField){
      console.log('it is populated', selectedField.name);
      document.getElementById('fieldNameOption').value = selectedField.name;
      document.getElementById('typeDropDown').value = selectedField.type;
      document.getElementById('primaryKeyDropDown').value = selectedField.primaryKey;
      document.getElementById('uniqueDropDown').value = selectedField.unique;
      document.getElementById('defaultValueOption').value = selectedField.defaultValue;
      document.getElementById('multipleValuesDropDown').value = selectedField.multipleValues;
      document.getElementById('requiredDropDown').value = selectedField.required;
    }
  }
  render() {
    console.log('props: ', this.props);
    
    return (
      <div>
        { this.props.addFieldClicked  &&
        <div id='options'>
          <h4>Options</h4>
          <form>
              <span>
                  Field Name : <input id='fieldNameOption' type='text' name='fieldNameValue' defaultValue={this.props.selectedField.name}/>
              </span>

              <span>Type : 
                <select id="typeDropDown" defaultValue={this.props.selectedField.type}>
                  <option value="String">String</option>
                  <option value="Number">Number</option>
                  <option value="Date">Date</option>
                  <option value="Boolean">Boolean</option>
                  <option value="ID">ID</option>
                </select>
              </span>

              <span>Primary Key :
                <select id="primaryKeyDropDown" defaultValue={this.props.selectedField.primaryKey}>
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>

              <span>Unique : 
                <select id="uniqueDropDown" defaultValue={this.props.selectedField.unique}>
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>
              <span>
                  Default Value : <input id='defaultValueOption' type='text' name='defaultValue' defaultValue={this.props.selectedField.defaultValue} />
              </span>

              <span>Required : 
                <select id="multipleValuesDropDown" defaultValue={this.props.selectedField.required}>
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>

              <span>Multiple Values : 
                <select id="requiredDropDown" defaultValue={this.props.selectedField.multipleValues}>
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>

              <span>Relation : 
                <select id="relationDropDown" defaultValue={this.props.selectedField.relation}>
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>
              <button onClick={this.submitOptions} className='btn btn-success'>
              {Object.keys(this.props.selectedField).length ? 'Update Field' : 'Create Field'}
              </button>
          </form>
        </div>
        }
        

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableOptions);