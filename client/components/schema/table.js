import React, { Component } from 'react';
import { connect} from 'react-redux';


const mapDispatchToProps = dispatch => ({
  deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
  // addField: fieldName => dispatch(actions.addField(fieldName)),
  deleteField: fieldName => dispatch(actions.deleteField(fieldName)),
})


  class Table extends Component {
    constructor(props) {
      super(props);
    } 
    render() {
      return (
        <div className='table'>
          <div>Table Name<button>x</button></div>
          <div>Table Field<button>x</button></div>
          <button>Add Field</button>
        </div>  
      )
    }
}

export default connect(mapDispatchToProps)(Table); 