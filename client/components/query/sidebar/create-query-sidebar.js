import React, { Component } from 'react';
import { connect } from 'react-redux';
import './sidebar.css';
import table from '../../schema/table';

const mapDispatchToProps = dispatch => ({
});

const mapStateToProps = store => ({
  tables: store.data.tables
});

class CreateQuerySidebar extends Component {
  constructor(props){
    super(props)
    this.state = {
      queryCreator: {
        queryType: '',
        querySearch: '',
        queryName: '',
        typeSelected: null,
      }
    }
    this.handleChange      = this.handleChange.bind(this);
    this.selectTypeHandler = this.selectTypeHandler.bind(this);
    this.submitHandler     = this.submitHandler.bind(this);
  }

  handleChange(event){
    const queryCreator = this.state.queryCreator
    queryCreator.queryName = event.target.value
    this.setState({queryCreator})
  }

  selectTypeHandler(event){
    const queryCreator = this.state.queryCreator

    // if the default select is picked, change state to default values. 
    if (event.target.value === 'default'){
      queryCreator.typeSelected = null;
      queryCreator.queryType = ''
    } 
    // otherwise update state of selected query type
    else {
      const tableIndex = event.target.value
      queryCreator.typeSelected = tableIndex
      queryCreator.queryType = this.props.tables[tableIndex].type
      console.log('queryCreator', queryCreator)
      this.setState({queryCreator})
    }
  }

  selectSearchHandler(event){
    console.log(event.target.value);
  }

  submitHandler(event){
    event.preventDefault();
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
    const selectedTableIndex = this.state.queryCreator.typeSelected
    if (selectedTableIndex){

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