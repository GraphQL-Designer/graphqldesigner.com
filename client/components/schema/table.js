import React, { Component } from 'react';
import { FormControl, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { connect} from 'react-redux';


const mapDispatchToProps = dispatch => ({
  deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
  addField: fieldName => dispatch(actions.addField(fieldName)),
  deleteField: fieldName => dispatch(actions.deleteField(fieldName)),
})


  class Table extends Component {
    constructor(props) {
      super(props);
    } 
  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th colSpan={2}>   
                <FormControl className="tableName" 
                  type="text" 
                  value= '' 
                  placeholder="Table Name"
                  onChange={(event) => {
                    props.updateTableName(event.target.value);
                  }} 
                />

                   
              </th>
            </tr>
            <tr>
            <td><FormControl className='fieldInput' 
            type="text" 
            placeholder="property" 
            value= '' 
            onChange={(event) => {
              // props.updateRowProp(event.target.value);
            }}
            />
            </td>
            </tr>
              
                       
                <tr>
                  <td className='addFieldWrap' colSpan={2}>
                    <button type="addField" onClick={() => addField(this.props.addField)}> ADD FIELD </button>
                  </td>
                </tr>                               
        </tbody>
      </table>
      <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip"> Delete table</Tooltip>}>
                    <div className="deleteTableButton" onClick={() => deleteTable(this.props.deleteTable)}>x</div>
                  </OverlayTrigger>
      <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip"> Delete field</Tooltip>}>
      <div className='deletefield' onClick={() =>deleteField(this.props.deleteField)}>x</div>
      </OverlayTrigger>
    </div>  
    )
  }
}

export default connect(mapDispatchToProps)(Table); 