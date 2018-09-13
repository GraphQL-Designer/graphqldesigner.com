import React, { Component } from 'react';
import { connect} from 'react-redux';
import * as actions from '../../actions/actions.js';


const mapDispatchToProps = dispatch => ({
  deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
  addField: fieldName => dispatch(actions.addField(fieldName)),
  deleteField: fieldName => dispatch(actions.deleteField(fieldName)),
});

class Table extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClick = this.handleClick.bind(this)
  } 

  handleDeleteTable(event){
    console.log(event.target.value);
  }
 // 
  handleDeleteField(event){
    console.log(event.target.value);
  }

  handleAddField(event){
    console.log(event.target.value);
  }

  render() {
    return (
      <div className='table'>
        <div>Table Name<button value={0} onClick={this.handleClick}>x</button></div>
        <div>Table Field<button value={0} onClick={this.handleClick}>x</button></div>
        <div>Table Field<button value={1} onClick={this.handleClick}>x</button></div>
        <button onClick={this.props.addField}>Add Field</button>
      </div>  
        //     <div>
        //     <table>
        //       <tbody>
        //         <tr>
        //           <th colSpan={2}>    
        //             <FormControl className="tableName" 
        //               type="text" 
        //               value=''
        //               placeholder="Table Name"
        //               onChange={(event) => {
        //                 props.updateTableName(event.target.value);
        //               }} 
        //             />     
        //           </th>
        //         </tr>
        //         <tr>
        //         <td><FormControl className='fieldInput' 
        //         type="text" 
        //         placeholder="property" 
        //         value=''
        //         onChange={(event) => {
        //           props.updateRowProp(event.target.value);
        //         }}
        //         />
        //         </td>    
        //         </tr>
        //             <tr>
        //               <td className='addFieldWrap' colSpan={2}>
        //                 <button type="addField" onClick={() => addField(this.props.addField)}> ADD FIELD </button>
        //               </td>
        //             </tr>                               
        //     </tbody>
        //   </table>
        //   <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip"> Delete table</Tooltip>}>
        //     <div className="deleteTableButton" onClick={() => deleteTable(this.props.deleteTable)}>x</div>
        //   </OverlayTrigger> 
        //   <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip"> Delete field</Tooltip>}>
        //     <div className='deletefield' onClick={() =>deleteField(this.props.deleteField)}>x</div>
        //   </OverlayTrigger>
        // </div> 
    )
  }
}

export default connect(mapDispatchToProps)(Table);
