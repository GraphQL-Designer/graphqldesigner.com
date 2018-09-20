import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions.js';

//styles
import TextField from 'material-ui/TextField';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import FlatButton from 'material-ui/FlatButton';
import './sidebar.css';

const mapStateToProps = store => ({
  database: store.data.database,
  tableIndex : store.data.tableIndexSelected,
  addFieldClicked: store.data.addFieldClicked,
  selectedField: store.data.selectedField,
  updatedField: store.data.fieldUpdated, 
  tableCount: store.data.tableCount,
  tables: store.data.tables
})

const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(actions.addField(field)),
  updateField: () => dispatch(actions.updateField()),
  handleChange: field => dispatch(actions.handleFieldsUpdate(field)),
  openTableCreator: () => dispatch(actions.openTableCreator())
})

class TableOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      selectedTableIndex : null
    }

    this.submitOptions = this.submitOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOpenTableCreator = this.handleOpenTableCreator.bind(this)
  }

  handleToggle () {this.setState({open: !this.state.open})};

  handleChange (event) {
    this.props.handleChange({name: event.target.name, value: event.target.value});
    
  };
  handleNullChange (event, index, nullValue) {
    event.preventDefault();
    this.setState({nullValue});
  };
  handleUniqueChange (event, index, uniqueValue) {
    event.preventDefault();
    this.setState({uniqueValue});
  };

  submitOptions(event){
    event.preventDefault();
    if(this.props.selectedField.name){
      this.props.updateField();
    }
  }

  handleOpenTableCreator(event){
    this.props.openTableCreator()
  }

  render() {
    // const optionsBackground = this.props.selectedField.fieldNum > -1 ? {backgroundColor: 'lightblue'} : {backgroundColor: '#5f5e5e'};
    
    // create option with default of empty string when viewed
    let tables = [<option key='empty'> </option>];
    let fields = [<option key='empty'> </option>];
    let tempTableNumList = [];

    // if there is more than one type, render the relation dropdown options in the sidebar
    if(this.props.tableCount > 1){
      for(let types in this.props.tables){
        if(this.props.selectedField.tableNum !== types){
          tables.push(<option key={types} value={this.props.tables[types].tableID.type}>{this.props.tables[types].type}</option>);
          tempTableNumList.push(types);
        }
      }

      let tempTableNum = 0;
      // iterate through list of types and get type index number matching type in relation selected
      for(let x = 0; x < tempTableNumList.length; x += 1){
        if(this.props.tables[tempTableNumList[x]].type === this.props.selectedField.relation.type[0]){
          tempTableNum = tempTableNumList[x];
        }
      }

      // list all of the fields for type selected in relation in sidebar
      for(let field in this.props.tables[tempTableNum].fields){
        fields.push(<option key={field} value={this.props.tables[tempTableNum].fields[field].name}>{this.props.tables[tempTableNum].fields[field].name}</option>)
      }
    }

    return (
      <div id='fieldOptions'> 
        { this.props.selectedField.tableNum > -1  &&
        <div id='options'>
          <FlatButton
            id='back-to-create'
            label="Create Table"
            icon={<KeyboardArrowLeft />}
            onClick={this.handleOpenTableCreator}
          />
          <form>
            <TextField
              hintText="Field Name"
              floatingLabelText="Field Name"
              fullWidth={true}
              name='name' 
              id='fieldNameOption' 
              onChange={this.handleChange} 
              value={this.props.selectedField.name}
              autoFocus
            />
            <TextField
                hintText="Default Value"
                floatingLabelText="Default Value"
                fullWidth={true}
                id='defaultValueOption'
                name='defaultValue' 
                onChange={this.handleChange}
                value={this.props.selectedField.defaultValue} 
              />
              <span>Type : 
                <select 
                  onChange={this.handleChange} 
                  id="typeDropDown" 
                  name='type' 
                  value={this.props.selectedField.type}
                >
                  <option value="String">String</option>
                  <option value="Number">Number</option>
                  {/* <option value="Date">Date</option> */}
                  <option value="Boolean">Boolean</option>
                  <option value="ID">ID</option>
                </select>
              </span>
              {this.props.database === 'SQL' && (<span> Primary Key :
                <select onChange={this.handleChange} id="primaryKeyDropDown" name='primaryKey' value={this.props.selectedField.primaryKey}>
                  <option value={false}>False</option>
                  <option value={true}>True</option>
                </select>
              </span>)}

                 <span>Required : 
                <select onChange={this.handleChange} id="requiredDropDown" name='required' value={this.props.selectedField.required}>
                  <option value={false}>False</option>
                  <option value={true}>True</option>
                </select>
              </span>

              <span>Unique : 
                <select onChange={this.handleChange} id="uniqueDropDown" name='unique' value={this.props.selectedField.unique}>
                  <option value={false}>False</option>
                  <option value={true}>True</option>
                </select>
              </span>
              
              <span>Multiple Values : 
                <select onChange={this.handleChange} id="multipleValuesDropDown" name='multipleValues' value={this.props.selectedField.multipleValues}>
                  <option value={false}>False</option>
                  <option value={true}>True</option>
                </select>
              </span>

              {this.props.tableCount > 1 && (<span>
                <p>Relation : </p>
                <p>Type:
                  <select onChange={this.handleChange} id="relationTypeDropDown" name='relation.type' value={this.props.selectedField.relation.type}>
                    {tables}
                  </select>
                </p>
                <p>Field:
                  <select onChange={this.handleChange} id="relationFieldDropDown" name='relation.field' value={this.props.selectedField.relation.field}>
                    {fields}
                  </select>
                </p>
                <p>RefType:
                  <select onChange={this.handleChange} id="relationRefTypeDropDown" name='relation.refType' value={this.props.selectedField.relation.refType}>
                    <option value="one to one">one to one</option>
                    <option value="one to many">one to many</option>
                  </select>
                </p>
              </span>)}
              <button onClick={this.submitOptions} className='btn btn-success'>
                {this.props.selectedField.fieldNum > -1 ?'Update Field' : 'Create Field'}
              </button>
          </form>
        </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableOptions);