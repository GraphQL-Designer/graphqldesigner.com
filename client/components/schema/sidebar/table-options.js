import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import * as actions from '../../../actions/actions.js';
// import { MenuItem, DropdownButton } from 'react-bootstrap';

import './sidebar.css';

const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(actions.addField(field)),
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
    const options = {
      type: document.getElementById('typeDropDown').value,
      primaryKey: document.getElementById('primaryKeyDropDown').value,
      unique: document.getElementById('uniqueDropDown').value,
      defaultValue: document.getElementById('defaultValueOption').value,
      required: document.getElementById('requiredDropDown').value,
      relation: document.getElementById('relationDropDown').value
    }

    console.log('options: ', options);
    this.props.createField(options);
  }

  render() {
    return (
      <div id='options'>
        <h4>Options</h4>
        <div>
          {/* <h5>Type: </h5> 
          <DropDownMenu
            value={this.state.typeValue}
            onChange={this.handleChange}
            className='dropdown'
            labelStyle = {{
              'fontSize': '20px'
            }}
            listStyle = {{
              'fontSize': '20px'
            }}
          >
            <MenuItem value={1} primaryText='String' />
            <MenuItem value={2} primaryText='Number' />
            <MenuItem value={3} primaryText='Date' />
            <MenuItem value={4} primaryText='Boolean' />
          </DropDownMenu>
        </div>
        <br/>
        <div>
          <h5>Unique: </h5> 
          <DropDownMenu
            value={this.state.uniqueValue}
            onChange={this.handleUniqueChange}
            className='dropdown'
            labelStyle = {{
              'fontSize': '20px'
            }}
            listStyle = {{
              'fontSize': '20px'
            }}
          >
            <MenuItem value={1} primaryText='False' />
            <MenuItem value={2} primaryText='True' />
          </DropDownMenu>

        </div>
        <br/>
        <div>
          <h5>Nulls: </h5> 
          <DropDownMenu
            value={this.state.nullValue}
            onChange={this.handleNullChange}
            className='dropdown'
            labelStyle = {{
              'fontSize': '20px'
            }}
            listStyle = {{
              'fontSize': '20px'
            }}
          >
            <MenuItem value={1} primaryText='False' />
            <MenuItem value={2} primaryText='True' />
          </DropDownMenu> */}


          {/* <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" id="menu1" type="button" data-toggle="dropdown">Type
            <span className="caret"></span></button>
            <ul className="dropdown-menu" role="menu" aria-labelledby="typeOption">
              <li role="presentation"><a className='options' role="menuitem" tabIndex="-1" href="#">String</a></li>
              <li role="presentation"><a className='options' role="menuitem" tabIndex="-1" href="#">Number</a></li>
              <li role="presentation"><a className='options' role="menuitem" tabIndex="-1" href="#">Date</a></li>
              <li role="presentation"><a className='options' role="menuitem" tabIndex="-1" href="#">Boolean</a></li>    
            </ul>
          </div> */}
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
              <form>
                Default Value : <input id='defaultValueOption' type='text' name='defaultValue' />
              </form>
            </span>

            <span>Required : 
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

        </div>
      </div>

    );
  }
}

export default TableOptions;