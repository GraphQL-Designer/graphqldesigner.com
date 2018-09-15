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
  addFieldClicked: store.data.addFieldClicked
})

const mapDispatchToProps = dispatch => ({
  // createField: field => dispatch(actions.addField(field))
})

class TableOptions extends React.Component {
  constructor(props) {
    super(props);

    this.submitOptions = this.submitOptions.bind(this);
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
      this.props.createField(options);
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
                  Field Name : <input id='fieldNameOption' type='text' name='fieldNameValue' />
              </span>

              <span>Type : 
                <select id="typeDropDown">
                  <option value="String">String</option>
                  <option value="Number">Number</option>
                  <option value="Date">Date</option>
                </select>
              </span>

              <span>Primary Key :
                <select id="primaryKeyDropDown">
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>

              <span>Unique : 
                <select id="uniqueDropDown">
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>
              <span>
                  Default Value : <input id='defaultValueOption' type='text' name='defaultValue' />
              </span>

              <span>Required : 
                <select id="multipleValuesDropDown">
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>

              <span>Multiple Values : 
                <select id="requiredDropDown">
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>

              <span>Relation : 
                <select id="relationDropDown">
                  <option value="False">False</option>
                  <option value="True">True</option>
                </select>
              </span>
              <button onClick={this.submitOptions} className='btn btn-success'>
              Submit
              </button>
          </form>
        </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableOptions);