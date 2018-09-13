import React from 'react';
// import { connect } from 'react-redux';
// import Drawer from 'material-ui/Drawer';
// import TextField from 'material-ui/TextField';
// import DropDownMenu from 'material-ui/DropDownMenu';
// import MenuItem from 'material-ui/MenuItem';

import CreateTable from './create-table';
// import TableOptions from './table-options';
import './sidebar.css';


class Sidebar extends React.Component {

  render() {
    return (
          <div id='tableContainer'>
            <CreateTable />
            {/* display options below after user creates table */}
            {/* <TableOptions /> */}
          </div>
    );
  }
}

export default Sidebar;