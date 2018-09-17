import React, { Component } from 'react';
import { connect } from 'react-redux';
import './sidebar.css';

const mapDispatchToProps = dispatch => ({
});

const mapStateToProps = store => ({
  tables: store.data.tables
});

class CreateQuerySidebar extends Component {
  constructor(props){
    super(props)
    this.state = {
        querySearchFor: null,
        queryName: '',
        selectedTableIndex: null,
    }
    this.handleChange        = this.handleChange.bind(this);
    this.selectTypeHandler   = this.selectTypeHandler.bind(this);
    this.selectSearchHandler = this.selectSearchHandler.bind(this);
    this.submitHandler       = this.submitHandler.bind(this);
  }

  // when a user types into the input for Query Name
  handleChange(event){
    console.log('this is state', this.state)

    this.setState({queryName: event.target.value})
  }

  // user selects a query type
  selectTypeHandler(event){
    console.log('this is state', this.state)
    // if the default select is picked, change state to default values. 
    if (event.target.value === 'default'){
      this.setState({selectedTableIndex: null})
    } 
    // Otherwise, user selected specific query type 
    else {
      this.setState({selectedTableIndex: event.target.value})
    }
  }

  // user selects how to search the particular type
  selectSearchHandler(event){
    console.log('this is state', this.state)

      // user selected to search for all of a type
      if (event.target.value === 'every'){
        this.setState({querySearchFor: 'every'})
      }
      // Otherwise, user selected a particular field to search for
      else {
        this.setState({querySearchFor: event.target.value})
      }
  }

  submitHandler(event){
    event.preventDefault();
    console.log(this.state)
  }

  render(){

    // Dynamically set the GraphQL types that can be selected based on Schema setup
    let graphQLTypeOptions = []
    for (let property in this.props.tables){
      const queryType = this.props.tables[property].type //name of query type
      graphQLTypeOptions.push(
        <option value={property}>{queryType}</option> //value is given property so we can access in selectHandler
      )
    }

    // Dynamically set the GraphQL search options to be selected based on selected GraphQL Type
    let graphQLSearchOptions = []
    const selectedTableIndex = this.state.selectedTableIndex
    if (selectedTableIndex){
      // Allow user to search for all of a type
      graphQLSearchOptions.push(
        <option value='Every'>Every {this.props.tables[selectedTableIndex].type}</option> 
      )

      // push all the fields of the selected type into graphQLSearchOptions
      for (let property in this.props.tables[selectedTableIndex].fields){
        const fieldName = this.props.tables[selectedTableIndex].fields[property].name
        graphQLSearchOptions.push(
          <option value={property}>{fieldName}</option> 
        )
      }
    }

    return (
      <div className='sidebar'>
        <h4>Create Custom Query</h4>
        <form onSubmit={this.submitHandler}> 
          <input type="text"
            placeholder="Query Name"
            value={this.state.queryName}
            onChange={this.handleChange} 
            />
          <br/>
          <select name='graphqlTypes' onChange={this.selectTypeHandler}>
            <option value='default'>Select Query Type</option> 
            {graphQLTypeOptions}
          </select>
          <br/>
          <select name='searchBy' onChange={this.selectSearchHandler}>
            <option value='default'>Select How Query Type is Searched</option> 
            {graphQLSearchOptions}
          </select>
          <br/>
          <input type="submit" 
            value="Create Query"
            />
        </form>
      </div>
    )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuerySidebar);