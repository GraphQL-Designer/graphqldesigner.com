import * as types from '../actions/action-types';

const initialState = {
  queryMode: 'create',
  selectedQuery: {
    queryName: '',
    tableIndex: -1,
    fieldIndex: -1
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

    case types.HANDLE_QUERY_CHANGE:
      console.log('changing');

      const newSelectedQuery = Object.assign({}, state.selectedQuery,
        {[action.payload.name]: action.payload.value})

      return {
        ...state,
        selectedQuery: newSelectedQuery
      }

    default:
      return state;
  }
};

export default queryReducers;
