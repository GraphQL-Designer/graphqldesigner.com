import * as types from '../actions/action-types';

const initialState = {
  queryMode: 'create',
  queriesIndex: 0,
  subQueryIndex: -1,
  queries: {},
  newQuery: {
    name: '',
    tableIndex: -1,
    fieldIndex: -1,
    returnFields: {},
    subQueries: []
  },
  subQuery: {
    // queryName: '',
    tableIndex: -1,
    fieldIndex: -1,
    returnFields: {}
  },
  newSubQuerySelected: false
};

const queryReducers = (state = initialState, action) => {

  const customQueryReset = {
    queryName: '',
    tableIndex: -1,
    fieldIndex: -1
  }

  let newReturnFields;
  let newReturnQuery;

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
    
    case types.HANDLE_SUBQUERY_SELECTED:
      return{
        ...state,
        newSubQuerySelected: action.payload.value
      }

    case types.CREATE_RETURN_FIELDS:
      newReturnFields = Object.assign({}, state.newQuery.returnFields, )


      Object.assign({}, state.newQuery, {returnFields : 
        Object.assign({}, state.newQuery.returnFields[action.payload.index], {name: action.payload.name, value: action.payload.value})})

        return{
          ...state,
          newQuery: newReturnFields
        }
    
    case types.HANDLE_RETURN_VALUES:
      console.log(action.payload);
      const { subQueryIndex, fieldIndex, tableIndex } = action.payload;
      console.log(!!state.newQuery.returnFields[fieldIndex]);
      if(subQueryIndex < 0) {
        if(!!state.newQuery.returnFields[fieldIndex]){
          newReturnFields = Object.assign({}, state.newQuery.returnFields)
          delete newReturnFields[fieldIndex];
          newReturnQuery = Object.assign({}, state.newQuery, {returnFields: newReturnFields})
        } else {
          newReturnFields = Object.assign({}, state.newQuery.returnFields, {[fieldIndex]: {fieldIndex, tableIndex}})
          newReturnQuery = Object.assign({}, state.newQuery, {returnFields: newReturnFields})
        }
      }

      return {
        ...state,
        newQuery: newReturnQuery
      }

    default:
      return state;
  }
};

export default queryReducers;
