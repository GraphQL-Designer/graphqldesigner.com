import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// we use store.data, because of index.js reduce function
const mapStateToProps = store => ({
  // fieldCount isn't used, but is necessary so the Table component rerenders after a field is deleted
  fieldCount: store.data.fieldCount
});

const mapDispatchToProps = dispatch => ({
  deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
  addField: fieldName => dispatch(actions.addFieldClicked(fieldName)),
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
    const tableIndex = this.props.tableIndex
    const fieldIndex = event.target.value
    this.props.deleteField([tableIndex, fieldIndex])
  }

  handleAddField(event){
    this.props.addField(this.props.tableIndex);
  }

  render() {
    console.log('table props', this.props)
    let fields = []

    // will push each individual field to the array 'fields' to be rendered. 
    for (let property in this.props.tableData.fields){
      fields.push(
        <div key={this.props.fieldCount}>{this.props.tableData.fields[property].name}
          <button 
            value={property}
            onClick={this.handleDeleteField}
            >{this.props.fieldCount}
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
