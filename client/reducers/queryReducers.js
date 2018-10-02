import * as types from '../actions/action-types';

const initialState = {
  queryMode: 'create',
  queriesIndex: 0,
  subQueryIndex: 0,
  queries: {},
  newQuery: {
    name: '',
    tableIndex: -1,
    fieldIndex: -1,
    returnFields: {},
    subQueries: []
  },
  subQuery: {
    tableIndex: -1,
    fieldIndex: -1,
    returnFields: {}
  }
};

const queryReducers = (state = initialState, action) => {

  const customQueryReset = {
    queryName: '',
    tableIndex: -1,
    fieldIndex: -1
  }

  switch (action.type) {
    case types.CREATE_QUERY: 
      console.log(action.payload);
      const newQuery = Object.assign({}, action.payload)
      
      return{
        ...state,
        queryMode: 'customQuery',
        selectedQuery: newQuery
      }
    
    case types.OPEN_CREATE_QUERY:
      console.log('going back to query');

      return {
        ...state,
        queryMode: 'create',
        selectedQuery: customQueryReset
      }
    
    case types.HANDLE_NEW_QUERY_CHANGE:
      const tempNewQuery = Object.assign({}, state.newQuery, 
        {[action.payload.name]: action.payload.value})
      
      return{
        ...state,
        newQuery: tempNewQuery
      }

    case types.HANDLE_SUBQUERY_CHANGE:
      const newSelectedQuery = Object.assign({}, state.subQuery,
        {[action.payload.name]: action.payload.value})

      return {
        ...state,
        subQuery: newSelectedQuery
      }

    default:
      return state;
  }
};

export default queryReducers;
