import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// //we use store.data, because of index.js reduce function
// const mapStateToProps = store => ({
//   tables: store.data.tables, 
//   //need below to subscribe to store. store.data.tables is an object so never changes
//   tableIndex: store.data.tableIndex 
// });


const mapDispatchToProps = dispatch => ({
  deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
  addField: fieldName => dispatch(actions.addField(fieldName)),
  deleteField: fieldName => dispatch(actions.deleteField(fieldName)),
});

class Table extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteTable = this.handleDeleteTable.bind(this)
    this.handleDeleteField = this.handleDeleteField.bind(this)
    this.handleAddField    = this.handleAddField.bind(this)
  } 

  handleDeleteTable(event){
    this.props.deleteTable(event.target.value)
  }

  handleDeleteField(event){
    this.props.deleteField(event.target.value)
  }

  handleAddField(event){
    this.props.addField(event.target.value)
  }

  render() {
    return (
      <div className='table'>
        <div>{this.props.tableData.tableName}
          <button 
            value={this.props.tableIndex} 
            onClick={this.handleDeleteTable}>x
          </button>
        </div>
        <div>Table Field
          <button 
            value={0} 
            onClick={this.handleDeleteField}>x
          </button>
        </div>
        <div>Table Field
          <button 
            value={1} 
            onClick={this.handleAddField}>x
          </button>
        </div>
        <button onClick={this.props.addField}>Add Field</button>
      </div>  
    )
  }
}

export default connect(null, mapDispatchToProps)(Table);
