import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';

import './sidebar.css';

export default class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false, value: 1};

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle () {this.setState({open: !this.state.open})};

  render() {
    return (
      // <div>
        <Drawer width={300} openSecondary={true} open={true} >
          <container>
          <AppBar title="New Table" />
            <newtable>
              <h4>New Table</h4>
              <TextField hintText='name'/>
              <RaisedButton label="Create" primary={true} />
            </newtable>
              <Divider />
            <options>
              <h4>Options</h4>
            </options>
          </container>
        </Drawer>
      // </div>
    );
  }
}
