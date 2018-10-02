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
  handleSubQueryChange: field => dispatch(actions.handleSubQueryChange(field)),
  handleSubquerySelected: field => dispatch(actions.handleSubquerySelected(field)),
  createReturnFields: returnFields => dispatch(actions.createReturnFields(returnFields)),
  handleReturnValues: returnValues => dispatch(actions.handleReturnValues(returnValues))
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
    this.handleNewQueryChange = this.handleNewQueryChange.bind(this);
    this.handleSubQueryChange = this.handleSubQueryChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleSubQueryChange = this.handleSubQueryChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.createReturnFields = this.createReturnFields.bind(this);
  }

  // when a user types into the input for Query Name
  handleNewQueryChange(event) {
    // this.setState({ queryName: event.target.value });
    this.props.handleNewQueryChange({
      name: event.target.name,
      value: event.target.value
    })
  }

  handleToggle(subQueryIndex, fieldIndex, tableIndex) {
    this.props.handleReturnValues({ subQueryIndex, fieldIndex, tableIndex });
  }

  // // user selects a query type
  // selectTypeHandler(event) {
  //   // if the default select is picked, change state to default values.
  //   if (event.target.value === 'default') {
  //     // this.setState({ selectedTableIndex: null });
  //     this.props.handleSubQueryChange({
  //       name: 'tableIndex',
  //       value: -1
  //     })
  //   }
  //   // Otherwise, user selected specific query type
  //   else {
  //     // this.setState({ selectedTableIndex: event.target.value });
  //     this.props.handleSubQueryChange({
  //       name: event.target.name,
  //       value: event.target.value
  //     })
  //   }
  // }

  // // user selects how to search the particular type
  // selectSearchHandler(event) {
  //   // user selected to search for all of a type
  //   if (event.target.value === 'every') {
  //     // this.setState({ querySearchFor: 'every' });
  //     this.props.handleQueryChange({
  //       name: 'querySearchFor',
  //       value: 'every'
  //     })
  //   }
  //   // Otherwise, user selected a particular field to search for
  //   else {
  //     // this.setState({ querySearchFor: event.target.value });
  //     this.props.handleQueryChange({
  //       name: event.target.name,
  //       value: event.target.value
  //     })
  //   }
  // }

  ///rename function since it dispatches handleNewQueryChange
  handleSubQueryChange(name, event, index, value) {
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
    // console.log(this.state);

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
    // this.createReturnFields(tableIndex, fieldIndex);
    // console.log('eyyyyyyy');
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
            console.log('ref: ', ref);
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
    console.log(temp);

    temp.forEach((el, i) => {
      const tableName = this.props.tables[el.tableIndex].type;
      const fieldName = this.props.tables[el.tableIndex].fields[el.fieldIndex].name;
      subQueryList.push(
        <MenuItem key={i} value={`${tableName}.${fieldName}.${el.refType}`} primaryText={`${tableName} - ${fieldName}`} />,
      )
    })
    // this.state.tables[tableIndex].fields)

  }
   
  // if(this.props.newSubQuerySelected){
  //   const subQueryList = [];
  //   let subQueryTableIndex = tableIndex;
  //   let subQueryFieldIndex = fieldIndex;
  //   let subQueryIndex = this.props.subQueryIndex

  //   if(subQueryIndex > 0){
  //     subQueryTableIndex = this.props.newQuery.subQueries[subQueryIndex].tableIndex;
  //     subQueryFieldIndex = this.props.newQuery.subQueries[subQueryIndex].fieldIndex;
  //   }
  
  //   for(const field in this.props.tables[subQueryTableIndex]){
  //     subQueryList.push(
  //       <Toggle
  //         label={this.props.tables[subQueryTableIndex].fields[subQueryFieldIndex].name}
  //         toggled={this.props.newSubQuerySelected}
  //         onToggle={this.handleToggle.bind(null, 'newSubQuerySelected')}
  //         style={style.toggle}
  //         disabled={this.props.tables[tableIndex].fields[fieldIndex].relation.tableIndex === -1}
  //       />
  //     )
  //   }
  // }


   
    return (
      <div className="sidebar-container">
        <h4>Create Custom Query</h4>
        <form onSubmit={this.submitHandler}>
          {/* <input type="text"
            placeholder="Query Name"
            value={this.state.queryName}
            onChange={this.handleChange}
            autoFocus
            /> */}
          <TextField
            name='name'
            hintText="Query Name"
            floatingLabelText="Query Name"
            value={this.props.newQuery.name}
            onChange={this.handleNewQueryChange}
            fullWidth={true}
            autoFocus
          />
          <div className='typeFieldInput'>
            <p>Type: </p>
            <DropDownMenu 
              value={this.props.newQuery.tableIndex}
              style={style.customWidth}
              onChange={this.handleSubQueryChange.bind(null, 'tableIndex')}
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
              onChange={this.handleSubQueryChange.bind(null, 'fieldIndex')}
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
                {/* { <RaisedButton
                label="Create Subquery"
                fullWidth
                secondary
                type="submit"
                />} */}
              </Paper>
            }
            {this.props.newQuery.tableIndex > -1 && this.props.newQuery.fieldIndex > -1 &&
              <Paper zDepth={3} style={style.paper}>
                <p>Subquery:</p>
                <DropDownMenu 
                  value={this.props.newQuery.tableIndex}
                  style={style.customWidth}
                  onChange={this.handleSubQueryChange.bind(null, 'tableIndex')}
                >
                  {subQueryList}
                </DropDownMenu>
                  
                
                {/* { <RaisedButton
                label="Create Subquery"
                fullWidth
                secondary
                type="submit"
                />} */}
              </Paper>  
            }
          <br />

          {/* toggle for create subQuery */}
          {/* {fieldIndex > -1 && this.props.tables[tableIndex].fields[fieldIndex].relation.tableIndex !== -1 &&
            <Toggle
              label='Create subquery'
              toggled={this.props.newSubQuerySelected}
              onToggle={this.handleToggle.bind(null, 'newSubQuerySelected')}
              style={style.toggle}
              disabled={this.props.tables[tableIndex].fields[fieldIndex].relation.tableIndex === -1}
            />
          } */}
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
