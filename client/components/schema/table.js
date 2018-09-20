import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// styling
import FlatButton from 'material-ui/FlatButton';
import Delete from 'material-ui/svg-icons/action/delete'
import RaisedButton from 'material-ui/RaisedButton';

const deleteStyle = {
  minWidth: '25px',
}
const fieldNameStyle = {
  width: '100%'
}


// we use store.data, because of index.js reduce function
const mapStateToProps = store => ({
  // fieldCount isn't used, but is necessary so the Table component rerenders after a field is deleted
  fieldCount: store.data.fieldCount,
  tables: store.data.tables,
  fieldUpdated: store.data.fieldUpdated,
  addFieldClicked: store.data.addFieldClicked
});

const mapDispatchToProps = dispatch => ({
  deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
  addField: fieldName => dispatch(actions.addFieldClicked(fieldName)),
  deleteField: fieldName => dispatch(actions.deleteField(fieldName)),
  updateField: fieldIndex => dispatch(actions.updateField(fieldIndex)),
  handleFieldsSelect: field => dispatch(actions.handleFieldsSelect(field))
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
    const fieldIndex = event.currentTarget.value //need currentTarget because of Material-UI
    this.props.deleteField([tableIndex, fieldIndex])
  }

  handleAddField(event){
    this.props.addField(this.props.tableIndex);
  }

  handleUpdateField(event){
    this.props.handleFieldsSelect({
      location: event.currentTarget.value,  //need currentTarget because of Material-UI
      submitUpdate: false
    })
  }


  
  render() {
    let fields = []

    // will push each individual field to the array 'fields' to be rendered. 
    for (let property in this.props.tableData.fields){
      const tableIndex = this.props.tableData.fields[property].tableNum;
      const fieldIndex = this.props.tableData.fields[property].fieldNum;
      const fieldName = this.props.tableData.fields[property].name
      const fieldType = this.props.tableData.fields[property].type

      fields.push(
        <div key={property} className='field'>
          <FlatButton
            label={`${fieldName} ${fieldType}`}
            value={`${tableIndex} ${fieldIndex}`}
            onClick={this.handleUpdateField}
            style={fieldNameStyle}
          />
          <FlatButton
            className='delete-button'
            icon={<Delete />}
            value={property}
            onClick={this.handleDeleteField}
            style={deleteStyle}
          />
        </div>
      )
    }
  
    return (
      <div className='table'>
        <div>
          <span className='btn btn-info'>{this.props.tableData.type}</span>
          <button
            className='btn btn-danger'
            value={this.props.tableIndex} 
            onClick={this.handleDeleteTable}>x
          </button>
        </div>
        <hr/>
        {fields}
        <RaisedButton 
          label="Add Field" 
          onClick={this.handleAddField}
        />
        {/* <button 
          onClick={this.handleAddField}
          >Add Field
        </button> */}
      </div>  
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
