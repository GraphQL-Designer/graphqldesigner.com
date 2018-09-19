import React, { Component } from 'react';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


//components
// import Sidebar from './sidebar/create-query-sidebar.js';
// import QueryCodeContainer from './query-code-container.js'
import CodeDBSchemaContainer from './code-dbschema-container.js';
import CodeClientContainer from './code-client-container.js';
import CodeServerContainer from './code-server-container.js';

class CodeApp extends Component {
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
    console.log('handleToggle')
    // let drawer = this.state.drawer
    // drawer.open = !drawer.open
    // if (drawer.css === 'drawer-closed') drawer.css = 'drawer'
    // else drawer.css = 'drawer-closed'
    // console.log(drawer)

    let drawer = this.state.drawer
    if (drawer.css === 'drawer-closed') drawer.css = 'drawer'
    else drawer.css = 'drawer-closed'
    drawer.open = !drawer.open
    console.log('this is drawer', drawer)

    // this.setState({open: !this.state.open});
    this.setState({drawer})
  }

  handleClose = () => {
    console.log('handleClose')
    // let drawer = this.state.drawer
    // drawer.open = false
    // drawer.css = 'drawer-closed'
    // this.setState({drawer});
    let drawer = this.state.drawer
    drawer.css = 'drawer-closed'
    drawer.open = false
    // console.log(css)


    // this.setState({css: 'drawer-closed'})
    this.setState({drawer});
  }

  // handleToggle = () => this.setState({open: !this.state.open});

  // handleClose = () => this.setState({open: false});
  
  render(){

    
  
    return (
      <div className='code-app'>
        <CodeDBSchemaContainer/>
        <CodeClientContainer/>
        <CodeServerContainer/>
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
            // open.css = 'drawer-closed'
            console.log('request change')
            // this.setState({css: 'drawer-closed'})
            // this.setState({open})}
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

export default CodeApp;