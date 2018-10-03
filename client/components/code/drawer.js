import React, { Component } from 'react';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

class DrawerSidebar extends Component {
  constructor (props){
    super(props)
    this.state = {
      drawer: {
        open: false,
        css: 'drawer-closed'
      }
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle = () => {
    let drawer = this.state.drawer
    if (drawer.css === 'drawer-closed') drawer.css = 'drawer'
    else drawer.css = 'drawer-closed'
    drawer.open = !drawer.open
    this.setState({drawer})
  }

  handleClose = () => {
    let drawer = this.state.drawer
    drawer.css = 'drawer-closed'
    drawer.open = false
    this.setState({drawer});
  }
  render(){
  
    return (
      <div>
        <RaisedButton
          label="Open Drawer"
          onClick={this.handleToggle}
          />
        <Drawer
          className='drawer-container'
          containerClassName={this.state.drawer.css}
          docked={false}
          width={200}
          open={this.state.drawer.open}
          onRequestChange={(open) => {
            let drawer = this.state.drawer
            drawer.open = open
            drawer.css = 'drawer-closed'
            this.setState({drawer})
          }}
          openSecondary={true}
          >
          <MenuItem onClick={this.handleClose}>Menu Item</MenuItem>
          <MenuItem onClick={this.handleClose}>Menu Item 2</MenuItem>
        </Drawer>
      </div>
    )
  }
};

export default DrawerSidebar;



