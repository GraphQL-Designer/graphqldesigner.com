import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions.js';

import RaisedButton from 'material-ui/RaisedButton';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import FlatButton from 'material-ui/FlatButton';
import './sidebar.css';

const mapStateToProps = store => ({

});

const mapDispatchToProps = dispatch => ({
  openCreateQuery: () => dispatch(actions.openCreateQuery())
});

class CustomizeQuerySidebar extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpenCreateQuery = this.handleOpenCreateQuery.bind(this);
    this.submitCustomQuery = this.submitCustomQuery.bind(this);
  }

  handleOpenCreateQuery () {
    this.props.openCreateQuery();
  }

  submitCustomQuery() {

  }

  render() {
    return (
      <div className='sidebar-container'>
        
  
        <div className='buttons-container'>
          {/* <h4>QuerySidebar</h4>
          <FlatButton
            id="back-to-query"
            label="Back"
            icon={<KeyboardArrowLeft />}
            onClick={this.handleOpenCreateQuery}
          />
          <RaisedButton
            label="Create"
            fullWidth
            secondary
            type="submit"
            onClick={this.submitCustomQuery}
          /> */}
        </div>
  
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomizeQuerySidebar);
