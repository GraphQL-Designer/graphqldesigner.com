import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';

// styling
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Delete from 'material-ui/svg-icons/action/delete'
import Close from 'material-ui/svg-icons/navigation/close'

const deleteStyle = {
  minWidth: '25px',
  position: 'absolute',
  right: '10px'
}
const fieldNameStyle = {
  width: '100%',
  height: '100%'
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
  handleFieldsSelect: field => dispatch(actions.handleFieldsSelect(field)),
  handleSelectedTable: tableIndex => dispatch(actions.handleSelectedTable(tableIndex))
});

class Table extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteTable = this.handleDeleteTable.bind(this)
    this.handleDeleteField = this.handleDeleteField.bind(this)
    this.handleAddField    = this.handleAddField.bind(this)
    this.handleUpdateField = this.handleUpdateField.bind(this)
    this.handleSelectedTable = this.handleSelectedTable.bind(this)
  } 

  handleDeleteTable(event){
    this.props.deleteTable(event.currentTarget.value) // need currentTarget because of Material-UI
  }

  handleDeleteField(event){
    const tableIndex = this.props.tableIndex
    const fieldIndex = event.currentTarget.value // need currentTarget because of Material-UI
    console.log(tableIndex, fieldIndex)
    this.props.deleteField([tableIndex, fieldIndex])
  }

  handleAddField(event){
    this.props.addField(this.props.tableIndex);
  }

  handleUpdateField(event){
    this.props.handleFieldsSelect({
      location: event.currentTarget.value,  // need currentTarget because of Material-UI
      submitUpdate: false
    })
  }

  handleSelectedTable(event){
    this.props.handleSelectedTable(event.currentTarget.value);
  }


  
  render() {
    let fields = []
    const colors = ['deeppink', 'crimson', 'orangered', 'gold', 'darkcyan', 'dodgerblue', 'darkviolet', 'seagreen', 'darkorange', 'tomato', 'mediumspringgreen', 'purple', 'darkkhaki', 'hotpink', 'firebrick', 'steelblue', 'limegreen', 'sienna', 'darkslategrey', 'goldenrod'];

    // will push each individual field to the array 'fields' to be rendered. 
    for (let property in this.props.tableData.fields){
      const tableIndex = this.props.tableData.fields[property].tableNum;
      const fieldIndex = this.props.tableData.fields[property].fieldNum;
      const fieldName = this.props.tableData.fields[property].name
      const fieldType = this.props.tableData.fields[property].type

      fields.push(
        <div key={property} className='field'>
          <FlatButton
            value={`${tableIndex} ${fieldIndex}`}
            onClick={this.handleUpdateField}
            style={fieldNameStyle}
          >
          {`${fieldName} - ${fieldType}`}
          </FlatButton>
          <FlatButton
            className='delete-button'
            icon={<Close />}
            value={property}
            onClick={this.handleDeleteField}
            style={{minWidth: '25px'}}
          />
        </div>
      )
    }
  
    return (
      <div className='table' style={{border: `1px solid ${colors[this.props.tableData.tableID]}`}}>
        <div>
          <div className='field'>
            <FlatButton
              backgroundColor={colors[this.props.tableData.tableID]}
              label={this.props.tableData.type}
              value={this.props.tableIndex}
              onClick={this.handleSelectedTable}
              style={fieldNameStyle}
            >
              {this.props.tableData.type}
            </FlatButton>
            <FlatButton
              className='delete-button'
              icon={<Delete />}
              value={this.props.tableIndex}
              onClick={this.handleDeleteTable}
              style={deleteStyle}
            />
          </div>
        </div>
        {fields}
        <RaisedButton 
          label="Add Field" 
          onClick={this.handleAddField}
        />
      </div>  
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
