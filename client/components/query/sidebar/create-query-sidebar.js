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
  }
};

const mapDispatchToProps = dispatch => ({
  createQuery: query => dispatch(actions.createQuery(query)),
  handleNewQueryChange: field => dispatch(actions.handleNewQueryChange(field)),
  handleSubQueryChange: field => dispatch(actions.handleSubQueryChange(field))
});

const mapStateToProps = store => ({
  tables: store.schema.tables,
  newQuery: store.query.newQuery,
  subQuery: store.query.subQuery
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
  }

  // when a user types into the input for Query Name
  handleNewQueryChange(event) {
    // this.setState({ queryName: event.target.value });
    this.props.handleNewQueryChange({
      name: event.target.name,
      value: event.target.value
    })
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

  submitHandler(event) {
    event.preventDefault();
    this.props.createQuery(this.state);
    console.log(this.state);
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
    // for(const options in this.props.tables[tableIndex].fields[fieldIndex]){
    //   fieldList.push(
    //     <ListItem 
    //       key={options}
    //       value={options.name}
    //       primaryText={options.name}>
          
    //     </ListItem>
    //   )
    // }
    fieldList.push(
      <ListItem
        key={tempCounter ++}
        value={this.props.tableIndex}
        primaryText={'id'}
      >
        {/* <Toggle
          label='idToggle'
          toggled={this.props.newQuery.returnFields.id}
          onToggle={this.handleToggle.bind(null, 'id')}
          style={style.toggle}
        /> */}
      </ListItem>
    )
    fieldList.push(
      <ListItem
        key={tempCounter++}
        value={this.props.fieldIndex}
        primaryText={'Name'}
        >
        </ListItem>
    )
   }

   // Dynamically retrieve list of field propertys for selecting to query
   
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

            <Paper zDepth={3} style={style.paper}>
              <List>
                {fieldList}
              </List>
              { <RaisedButton
              label="Create Subquery"
              fullWidth
              secondary
              type="submit"
              />}
            </Paper>
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
