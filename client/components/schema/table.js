import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// //we use store.data, because of index.js reduce function
const mapStateToProps = store => ({
  tables: store.data.tables, 
  fieldCount: store.data.fieldCount
  //need below to subscribe to store. store.data.tables is an object so never changes
  // tableIndex: store.data.tableIndex 
});


const mapDispatchToProps = dispatch => ({
  deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
  addField: fieldName => dispatch(actions.addFieldClicked(fieldName)),
  deleteField: fieldName => dispatch(actions.deleteField(fieldName)),
  updateField: fieldIndex => dispatch(actions.updateField(fieldIndex))
});

class Table extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteTable = this.handleDeleteTable.bind(this)
    this.handleDeleteField = this.handleDeleteField.bind(this)
    this.handleAddField    = this.handleAddField.bind(this)
    this.handleUpdateField = this.handleUpdateField.bind(this)
  } 

  handleDeleteTable(event){
    this.props.deleteTable(event.target.value)
  }

  handleDeleteField(event){
    const tableIndex = this.props.tableIndex
    const fieldIndex = event.target.value
    this.props.deleteField([tableIndex, fieldIndex])
  }

  handleAddField(event){
    this.props.addField(this.props.tableIndex);
  }

  handleUpdateField(event){
    console.log(this.props.tableData);
    this.props.updateField({
      fieldIndex: event.target.id,
      tableIndex: this.props.tableIndex,
      submitUpdate: false
    })
  }

  
  render() {
    console.log('table render, this is field count', this.props.fieldCount)

    let fields = []
    for (let property in this.props.tableData.fields){
      fields.push
      (
        <div>
          <button 
            className='btn btn-success'
            id={property}
            onClick={this.handleUpdateField}
          >
            {this.props.tableData.fields[property].name}
            </button>
          <button 
            className='btn btn-danger'
            value={property}
            onClick={this.handleDeleteField}
          >
            x
          </button>
        </div>
      )
    }
  
    return (
      <div className='table'>
       <script>console.log('hi')</script>
        <div>{this.props.tableData.tableName}
          <button
            value={this.props.tableIndex} 
            onClick={this.handleDeleteTable}>x
          </button>
        </div>
         {/* <div>Table Field
          <button 
            value={0}
            onClick={this.handleDeleteField}>x
          </button>
        </div> */}
        {fields}
        <button 
          onClick={this.handleAddField}
          >Add Field
        </button>
      </div>  
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
