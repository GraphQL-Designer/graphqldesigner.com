import React, { Component } from 'react';
import { connect } from 'react-redux';
import SubQuery from './subquery.jsx'

// styles
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { List } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { Toggle } from 'material-ui';
import * as actions from '../../../actions/actions.js';
import './sidebar.css';

const style = {
  customWidth: {
    marginTop: '-7px',
    width: '100%',
  },
  toggle: {
    marginTop: '5px',
    marginLeft: '5%',
    width: '90%',
  },
  list: {
    fontSize: '14px',
    maxHeight: '45px', 
    padding: '0',
    display: 'flex',
    flexDirection: 'vertical',
  },
  listItem: {
    fontSize: '14px',
    maxHeight: '20px', 
    padding: '0px',
  },
  paper: {
    // maxHeight: '250px',
    marginTop: '25px',
    marginBottom: '5px',
    backgroundColor: 'rgb(54, 58, 66)',
    // overflow: 'scroll'
  },
  menuItem: {
    width: '100%',
  },
  button: {
    marginTop: '25px',
  },
};

const mapStateToProps = store => ({
  // tables: store.schema.tables,
  // newQuery: store.query.newQuery,
  // subQuery: store.query.subQuery,
  // newSubQuerySelected: store.query.newSubQuerySelected,
  // subQueryIndex: store.query.subQueryIndex,
});

const mapDispatchToProps = dispatch => ({
  // createQuery: query => dispatch(actions.createQuery(query)),
  // handleNewQueryChange: field => dispatch(actions.handleNewQueryChange(field)),
  // createReturnFields: returnFields => dispatch(actions.createReturnFields(returnFields)),
  // handleReturnValues: returnValues => dispatch(actions.handleReturnValues(returnValues)),
  // handleSubQuerySelector: tableFieldIndexes => dispatch(actions.handleSubQuerySelector(tableFieldIndexes)),
  // handleNewQueryName: name => dispatch(actions.handleNewQueryName(name)),
  // handleNewSubQueryToggle: field => dispatch(actions.handleNewSubQueryToggle(field)),
  // submitSubQueryHandler: subQuery => dispatch(actions.submitSubQueryHandler(subQuery)),
});

class CreateQuerySidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      querySearchFor: null,
      queryName: '',
      selectedTableIndex: null,
    };

    this.handleNewQueryName = this.handleNewQueryName.bind(this);
    this.handleNewQueryChange = this.handleNewQueryChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    // this.createReturnFields = this.createReturnFields.bind(this);
    this.submitSubQueryHandler = this.submitSubQueryHandler.bind(this);
  }

  // when a user types into the input for Query Name
  handleNewQueryName(event) {
    this.props.handleNewQueryName({
      name: event.target.name,
      value: event.target.value,
    })
  }

  handleToggle(subQueryIndex, fieldIndex, tableIndex, returnFieldsIndex) {
    this.props.handleReturnValues({ subQueryIndex, fieldIndex, tableIndex, returnFieldsIndex });
  }

  ///rename function since it dispatches handleNewQueryChange
  handleNewQueryChange(name, event, index, value) {
    this.props.handleNewQueryChange({
      name: name,
      value: value,
    })
  }

  // createReturnFields(tableIndex, fieldIndex){
  //   this.props.createReturnFields({
  //     index: fieldIndex,
  //     name: this.props.tables[tableIndex].fields[fieldIndex].name,
  //     value: false,
  //   });
  // }

  submitHandler(event) {
    event.preventDefault();
    if(this.props.newQuery.name.length > 0 && this.props.newQuery.tableIndex > -1 && this.props.newQuery.fieldIndex > -1){
      this.props.createQuery(this.props.newQuery);
    }
    // this.props.createQuery(this.state);
  }

  submitSubQueryHandler(event){
    event.preventDefault();
    this.props.submitSubQueryHandler(this.props.subQuery);
    // this.props.handleSubQuerySelector({tableIndex: this.props.subQuery.tableIndex, fieldIndex: this.props.subQuery.fieldIndex})
  }

  handleSubQuerySelector(tableIndex, fieldIndex, refType) {
    this.props.handleSubQuerySelector({tableIndex, fieldIndex, refType})
  }

  handleNewSubQueryToggle(fieldIndex, tableIndex) {
    this.props.handleNewSubQueryToggle({ fieldIndex, tableIndex });
  }

  render() {
    // console.log('newQuery', this.props.newQuery)
    // Dynamically set the GraphQL types that can be selected based on Schema setup
    const graphQLTypeOptions = [];
    const tableIndex = Number(this.props.newQuery.tableIndex);
    
    for (const property in this.props.tables) {
      const queryType = this.props.tables[property].type; // name of query type
      graphQLTypeOptions.push(
        <MenuItem
          key={property}
          value={property}
          primaryText={queryType}
          disabled={this.props.subQueryIndex > -1}
        />,
      );
    }

    // Dynamically set the GraphQL search options to be selected based on selected GraphQL Type
    const graphQLSearchOptions = [];
    // const selectedTableIndex = this.state.selectedTableIndex;
    if (tableIndex > -1) {
      // push all the fields of the selected type into graphQLSearchOptions
      for (const property in this.props.tables[tableIndex].fields) {
        const fieldName = this.props.tables[tableIndex].fields[property].name;
        graphQLSearchOptions.push(
          <MenuItem key={property} value={property} primaryText={fieldName} disabled={this.props.subQueryIndex > -1}/>,
        );
      }
   }

   // Dynamically retrieve and display field options & relations for selected field 
  const fieldList = [];
  const fieldIndex = Number(this.props.newQuery.fieldIndex);
  if(fieldIndex > -1){
    for (const property in this.props.tables[tableIndex].fields) {
      const fieldName = this.props.tables[tableIndex].fields[property].name;
      fieldList.push(
        <Toggle
          key={property}
          label={fieldName}
          onToggle={this.handleToggle.bind(this, -1, property, tableIndex)}
          style={style.toggle}
        />,
      )
    }
  }

  let subQueryList = [];
  let listSubqueries = [];

  //if fieldIndex has relations, render the relations
  let relations = [];
  if(this.props.newQuery.tableIndex > -1 && this.props.newQuery.fieldIndex > -1){
    if(this.props.subQueryIndex < 0){
      for(const fieldID in this.props.tables[tableIndex].fields){
        let field = this.props.tables[tableIndex].fields[fieldID];
        if(field.relation.tableIndex !== -1){
          relations.push(field.relation)
        }
        if(field.refBy.size){
          field.refBy.forEach(ref => {
            const refSplit = ref.split('.');
            const refTableIndex = refSplit[0];
            const refFieldIndex = refSplit[1];
            const refRefType = refSplit[2];
            relations.push({
              tableIndex : refTableIndex,
              fieldIndex: refFieldIndex,
              refType: refRefType,
            })
          })
        }
      }
    } else {
      const newSubQueryTableIndex = this.props.newQuery.subQueries[this.props.subQueryIndex].tableIndex;
      const newSubQueryFieldIndex = this.props.newQuery.subQueries[this.props.subQueryIndex].fieldIndex;
      for(const fieldID in this.props.tables[newSubQueryTableIndex].fields){
        let field = this.props.tables[newSubQueryTableIndex].fields[fieldID];
        if(Number(field.relation.tableIndex) !== -1){
          relations.push(field.relation)
        }
        if(field.refBy.size){
          field.refBy.forEach(ref => {
            const refSplit = ref.split('.');
            const refTableIndex = refSplit[0];
            const refFieldIndex = refSplit[1];
            const refRefType = refSplit[2];
            relations.push({
              tableIndex : refTableIndex,
              fieldIndex: refFieldIndex,
              refType: refRefType,
            })
          })
        }
      }
    }

    relations.forEach((el, i) => {
      const tableName = this.props.tables[el.tableIndex].type;
      const fieldName = this.props.tables[el.tableIndex].fields[el.fieldIndex].name;
      subQueryList.push(
        <MenuItem key={i} 
          value={`${el.tableIndex}.${el.fieldIndex}`} 
          primaryText={`${tableName} - ${fieldName}`} 
          onClick={this.handleSubQuerySelector.bind(this, el.tableIndex, el.fieldIndex, el.refType)} 
          style={style.menuItem}
        />,
      )
    })

    if(this.props.subQuery.tableIndex > -1){
      for(const fieldID in this.props.tables[this.props.subQuery.tableIndex].fields){
        let field = this.props.tables[this.props.subQuery.tableIndex].fields[fieldID];
          listSubqueries.push(
            <Toggle
              key={fieldID}
              label={field.name}
              onToggle={this.handleNewSubQueryToggle.bind(this, field.fieldNum, field.tableNum)}
              style={style.toggle}
            /> 
        )
      }
    }
  }
  
    return (
      <div className="sidebar-container">
        <h2 style={{margin: '10px'}}>Create Query</h2>
        <form style={{marginTop: '-15px'}}>
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
            {this.props.newQuery.tableIndex > -1 && this.props.newQuery.fieldIndex > -1 &&
              <div style={style.paper}>
                <h4 style={{margin: '5px'}}>Return Values:</h4>
                <List>
                  {fieldList}
                </List>
              </div>
            }
            {this.props.newQuery.subQueries.length > 0 && (
              <div style={{ marginTop: '10px'}}>
                <h4 style={{marginLeft: '5px'}}>Sub Queries:</h4>
                <List style={{backgroundColor: 'rgb(54, 58, 66)'}}>
                {this.props.newQuery.subQueries.map((query, i) => (
                  <SubQuery key={i} tableIndex={query.tableIndex} fieldIndex={query.fieldIndex} 
                  newQuery={this.props.newQuery} tables={this.props.tables} subQueryIndex={this.props.subQueryIndex} onToggle={this.handleToggle.bind(this, i, query.fieldIndex, query.tableIndex)}/>
                ))}
                </List>
              </div>
            )}
            {this.props.newQuery.tableIndex > -1 && this.props.newQuery.fieldIndex > -1 &&
              <div style={style.paper}>
                <h4 style={{margin: '5px'}}>Create Subquery:</h4>
                <div className='flexRow'>
                  <p style={{marginLeft: '10px'}}>By: </p>
                  <DropDownMenu 
                    value={`${this.props.subQuery.tableIndex}.${this.props.subQuery.fieldIndex}`}
                    style={style.customWidth}
                  >
                    {subQueryList}
                  </DropDownMenu>
                </div>
                <div style={{height: '10px', width: '100%'}} />
               {this.props.subQuery.tableIndex > -1 && (
                  <div>
                      {listSubqueries}
                      <div style={{height: '10px', width: '100%'}} />
                      <RaisedButton
                        label="Create SubQuery"
                        fullWidth
                        secondary
                        type="submit"
                        onClick={this.submitSubQueryHandler}
                      />  
                  </div>
                )}
              </div>  
            }
          <RaisedButton
            style={style.button}
            label="Create Query"
            fullWidth
            secondary
            type="submit"
            onClick={this.submitHandler}
          />
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuerySidebar);