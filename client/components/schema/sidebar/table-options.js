import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
// import MenuItem from 'material-ui/MenuItem';
import * as actions from '../../../actions/actions.js';
import { MenuItem, DropdownButton } from 'react-bootstrap';

import './sidebar.css';

class TableOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false, 
      typeValue: 1, // 1='String', 2='Number', 3='Date', 4='Boolean'
      nullValue: 1, // 1='False', 2='True'
      uniqueValue: 1 // 1='False', 2='True'
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNullChange = this.handleNullChange.bind(this);
    this.handleUniqueChange = this.handleUniqueChange.bind(this);
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

  render() {
    return (
      <div id='options'>
        <h4>Options</h4>
        <div>
          {/* <h5>Type: </h5>  */}
          {/* <DropDownMenu
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
          </DropDownMenu> */}

        {/* </div>
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

          <DropdownButton
            bsStyle='default'
            title={'Type'}
            id='typeId'
            key={this.state.typeValue}
          >
            <MenuItem eventKey="1">String</MenuItem>
            <MenuItem eventKey="2">Number</MenuItem>
            <MenuItem eventKey="3">Date</MenuItem>
            <MenuItem eventKey="4">Boolean</MenuItem>
          </DropdownButton>
        </div>
      </div>

    );
  }
}

export default TableOptions;