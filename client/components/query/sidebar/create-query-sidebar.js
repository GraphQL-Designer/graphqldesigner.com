import React, { Component } from 'react';
import { connect } from 'react-redux';

// styles
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import { Toggle } from 'material-ui';
import * as actions from '../../../actions/actions.js';
import './sidebar.css';

const style = {
  customWidth: {
    width: 200
  },
  toggle: {
    marginTop: '5px'
  },
  list: {
    fontSize: '14px',
    maxHeight: '45px', 
    padding: '0',
    display: 'flex',
    flexDirection: 'vertical'
  },
  listItem: {
    fontSize: '14px',
    maxHeight: '20px', 
    padding: '0px'
  },
  paper : {
    // display: 'flex',
    maxHeight: '100px'
  },
  toggle: {
    marginTop: '5px',
  },
};

const mapStateToProps = store => ({
  tables: store.schema.tables,
  newQuery: store.query.newQuery,
  subQuery: store.query.subQuery,
  newSubQuerySelected: store.query.newSubQuerySelected,
  subQueryIndex: store.query.subQueryIndex
});

const mapDispatchToProps = dispatch => ({
  createQuery: query => dispatch(actions.createQuery(query)),
  handleNewQueryChange: field => dispatch(actions.handleNewQueryChange(field)),
  createReturnFields: returnFields => dispatch(actions.createReturnFields(returnFields)),
  handleReturnValues: returnValues => dispatch(actions.handleReturnValues(returnValues)),
  handleSubQuerySelector: tableFieldIndexes => dispatch(actions.handleSubQuerySelector(tableFieldIndexes)),
  handleNewQueryName: name => dispatch(actions.handleNewQueryName(name)),
  handleNewSubQueryToggle: field => dispatch(actions.handleNewSubQueryToggle(field))
});

class CreateQuerySidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      querySearchFor: null,
      queryName: '',
      selectedTableIndex: null,
    };

    // this.selectTypeHandler = this.selectTypeHandler.bind(this);
    // this.selectSearchHandler = this.selectSearchHandler.bind(this);
    this.handleNewQueryName = this.handleNewQueryName.bind(this);
    this.handleNewQueryChange = this.handleNewQueryChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.createReturnFields = this.createReturnFields.bind(this);
  }

  // when a user types into the input for Query Name
  handleNewQueryName(event) {
    // this.setState({ queryName: event.target.value });
    this.props.handleNewQueryName({
      name: event.target.name,
      value: event.target.value
    })
  }

  handleToggle(subQueryIndex, fieldIndex, tableIndex) {
    this.props.handleReturnValues({ subQueryIndex, fieldIndex, tableIndex });
  }

  ///rename function since it dispatches handleNewQueryChange
  handleNewQueryChange(name, event, index, value) {
    this.props.handleNewQueryChange({
      name: name,
      value: value
    })
  }

  createReturnFields(tableIndex, fieldIndex){
    this.props.createReturnFields({
      index: fieldIndex,
      name: this.props.tables[tableIndex].fields[fieldIndex].name,
      value: false
    });
  }

  submitHandler(event) {
    event.preventDefault();
    // this.props.createQuery(this.state);

  }

  handleSubQuerySelector(tableIndex, fieldIndex) {
    this.props.handleSubQuerySelector({tableIndex, fieldIndex})
  }

  handleNewSubQueryToggle(fieldIndex, tableIndex) {
    console.log('here', fieldIndex, tableIndex)
    this.props.handleNewSubQueryToggle({ fieldIndex, tableIndex });
  }

  render() {
    // Dynamically set the GraphQL types that can be selected based on Schema setup
    const graphQLTypeOptions = [];
    const tableIndex = Number(this.props.newQuery.tableIndex);
    
    for (const property in this.props.tables) {
      const queryType = this.props.tables[property].type; // name of query type
      graphQLTypeOptions.push(
        // <option key={property} value={property}>{queryType}</option>, // value is given property so we can access in selectHandler
        <MenuItem
          key={property}
          value={property}
          primaryText={queryType}
        />
      );
    }

    // Dynamically set the GraphQL search options to be selected based on selected GraphQL Type
    const graphQLSearchOptions = [];
    // const selectedTableIndex = this.state.selectedTableIndex;
    if (tableIndex > -1) {
      // Allow user to search for all of a type
      graphQLSearchOptions.push(
        <option key={'temp'} value="Every">
          Every
          {' '}
          {this.props.tables[tableIndex].type}
        </option>,
      );
      // push all the fields of the selected type into graphQLSearchOptions
      for (const property in this.props.tables[tableIndex].fields) {
        const fieldName = this.props.tables[tableIndex].fields[property].name;
        graphQLSearchOptions.push(
          // <option key={property} value={property}>{fieldName}</option>,
          <MenuItem key={property} value={property} primaryText={fieldName} />,
        );
      }
   }

   // Dynamically retrieve and display field options & relations for selected field 
  const fieldList = [];
  let tempCounter = 0;
  const fieldIndex = Number(this.props.newQuery.fieldIndex);
  if(fieldIndex > -1){
    console.log('yo: ', this.props.tables, tableIndex)
    for (const property in this.props.tables[tableIndex].fields) {
      const fieldName = this.props.tables[tableIndex].fields[property].name;
      fieldList.push(
        <Toggle
          key={property}
          label={fieldName}
          // toggled={this.props.newQuery.returnFields[property].value}
          onToggle={this.handleToggle.bind(this, this.props.subQueryIndex, property, tableIndex)}
          style={style.toggle}
        />
      )
    }
  }

  let subQueryList = [];
  let listSubqueries = [];

  //if fieldIndex has relations, render the relations
  let temp = [];
  if(this.props.newQuery.tableIndex > -1 && this.props.newQuery.fieldIndex > -1){
    if(this.props.subQueryIndex < 0){
      for(const fieldID in this.props.tables[tableIndex].fields){
        let field = this.props.tables[tableIndex].fields[fieldID];
        if(field.relation.tableIndex !== -1){
          temp.push(field.relation)
        }
        if(field.refBy.size){
          field.refBy.forEach(ref => {
            const refSplit = ref.split('.');
            const refTableIndex = refSplit[0];
            const refFieldIndex = refSplit[1];
            const refRefType = refSplit[2];
            temp.push({
              tableIndex : refTableIndex,
              fieldIndex: refFieldIndex,
              refType: refRefType
            })
          })
        }
      }
    }

    temp.forEach((el, i) => {
      const tableName = this.props.tables[el.tableIndex].type;
      const fieldName = this.props.tables[el.tableIndex].fields[el.fieldIndex].name;
      subQueryList.push(
        <MenuItem key={i} value={`${tableName}.${fieldName}.${el.refType}`} primaryText={`${tableName} - ${fieldName}`} onClick={this.handleSubQuerySelector.bind(this, el.tableIndex, el.fieldIndex)}/>,
      )
    })
    // this.state.tables[tableIndex].fields)

    if(this.props.subQuery.tableIndex > -1){
      for(const fieldID in this.props.tables[this.props.subQuery.tableIndex].fields){
        let field = this.props.tables[this.props.subQuery.tableIndex].fields[fieldID];
          listSubqueries.push(
            <Toggle
              key={fieldID}
              label={field.name}
              // toggled={this.props.newQuery.returnFields[property].value}
              onToggle={this.handleNewSubQueryToggle.bind(this, field.fieldNum, field.tableNum)}
              style={style.toggle}
            />
        )
      }
    }
  }
  
    return (
      <div className="sidebar-container">
        <h4>Create Custom Query</h4>
        <form onSubmit={this.submitHandler}>
          <TextField
            name='name'
            hintText="Query Name"
            floatingLabelText="Query Name"
            value={this.props.newQuery.name}
            onChange={this.handleNewQueryName}
            fullWidth={true}
            autoFocus
          />
          <div className='typeFieldInput'>
            <p>Type: </p>
            <DropDownMenu 
              value={this.props.newQuery.tableIndex}
              style={style.customWidth}
              onChange={this.handleNewQueryChange.bind(null, 'tableIndex')}
            >
              {graphQLTypeOptions}
            </DropDownMenu>
          </div>
          <br />
          <div className='typeFieldInput'>
            <p>Field: </p>
            <DropDownMenu
              value={this.props.newQuery.fieldIndex}
              style={style.customWidth}
              onChange={this.handleNewQueryChange.bind(null, 'fieldIndex')}
            >
              {graphQLSearchOptions}
            </DropDownMenu>
          </div>
            <br />
            {this.props.newQuery.tableIndex > -1 && this.props.newQuery.fieldIndex > -1 &&
              <Paper zDepth={3} style={style.paper}>
                <p>Return Values:</p>
                <List>
                  {fieldList}
                </List>
              </Paper>
            }
            {this.props.newQuery.tableIndex > -1 && this.props.newQuery.fieldIndex > -1 &&
              <Paper zDepth={3} style={style.paper}>
              <br />
                <p>Subquery:</p>
                <DropDownMenu 
                  value={this.props.newQuery.tableIndex}
                  style={style.customWidth}
                >
                  {subQueryList}
                </DropDownMenu>

                {this.props.subQuery.tableIndex > -1 && (
                  <div>
                    {listSubqueries}
                  </div>
                )}
              </Paper>  
            }
          <br />
          <RaisedButton
            label="Create Query"
            fullWidth
            secondary
            type="submit"
          />
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuerySidebar);
