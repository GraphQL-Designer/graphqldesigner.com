import * as types from '../actions/action-types';

const initialState = {
  queriesIndex: 0,
  subQueryIndex: -1,
  queries: {},
  newQuery: {
    name: '',
    tableId: -1,
    fieldId: -1,
    returnFields: {},
    subQueries: []
  },
  subQuery: {
    // queryName: '',
    tableId: -1,
    fieldId: -1,
    returnFields: {}
  },
  newSubQuerySelected: false
};

const queryReducers = (state = initialState, action) => {

  const customQueryReset = {
    queryName: '',
    tableId: -1,
    fieldId: -1
  }

  let subQueryIndex = state.subQueryIndex;
  let newReturnFields;
  let newReturnQuery;
  let newSubQuery;
  let tempNewQuery;
  let newSubQueries;

  switch (action.type) {

    // Create finalized custom query
    case types.CREATE_QUERY: 
      const newQuery = Object.assign({}, action.payload)
      
      return{
        ...state,
        queriesIndex: newQueriesIndex,
        queryMode: 'customQuery',
        selectedQuery: newQuery
      }
    
    case types.OPEN_CREATE_QUERY:

      return {
        ...state,
        queryMode: 'create',
        selectedQuery: customQueryReset
      }
    
    // User inputs name for new customized query
    case types.HANDLE_NEW_QUERY_NAME:
      tempNewQuery = Object.assign({}, state.newQuery, 
        {name: action.payload.value})
      
      return{
        ...state,
        newQuery: tempNewQuery
      }
      
    // case types.CREATE_RETURN_FIELDS:
    //   newReturnFields = Object.assign({}, state.newQuery.returnFields, )
      
    //   Object.assign({}, state.newQuery, {returnFields : 
    //     Object.assign({}, state.newQuery.returnFields[action.payload.index], {name: action.payload.name, value: action.payload.value})})
        
    //   return{
    //     ...state,
    //     newQuery: newReturnFields
    //   }
        
    case types.HANDLE_RETURN_VALUES:
    let { subQueryIndex, fieldId, tableId, returnFieldsIndex } = action.payload;

    if(subQueryIndex < 0) {
      if(!!state.newQuery.returnFields[fieldId]) {
        newReturnFields = Object.assign({}, state.newQuery.returnFields)
        delete newReturnFields[fieldId];
        newReturnQuery = Object.assign({}, state.newQuery, {returnFields: newReturnFields})
      } else {
        newReturnFields = Object.assign({}, state.newQuery.returnFields, {[fieldId]: {fieldId, tableId}})
        newReturnQuery = Object.assign({}, state.newQuery, {returnFields: newReturnFields})
      }
      return {
        ...state,
        newQuery: newReturnQuery
      }
    } else {
      if(!!state.newQuery.subQueries[subQueryIndex].returnFields[returnFieldsIndex]) {
        newReturnFields = Object.assign({}, state.newQuery.subQueries[subQueryIndex].returnFields)
        delete newReturnFields[returnFieldsIndex]       
        newReturnQuery =Object.assign({}, state.newQuery);
        newReturnQuery.subQueries[Number(subQueryIndex)].returnFields = newReturnFields;
      } else {
        newReturnQuery = Object.assign({}, state.newQuery, {})
      }

      return {
        ...state,
        newQuery: newReturnQuery
      }
    }

    // User selects type or field for customized query
    case types.HANDLE_NEW_QUERY_CHANGE:
      if (action.payload.name === 'tableId') {
        const fieldId = {'fieldId': -1}; // reset field since a new table was selected
        const tableId = {[action.payload.name]: action.payload.value}
        tempNewQuery = Object.assign({}, state.newQuery, tableId, fieldId)
      } else {
        tempNewQuery = Object.assign({}, state.newQuery, 
          {[action.payload.name]: action.payload.value})
      }
      
      return{
        ...state,
        newQuery: tempNewQuery
      }
    

    case types.HANDLE_SUBQUERY_SELECTOR:
    newSubQuery = Object.assign({}, state.subQuery, {
      tableId: action.payload.tableId,
      fieldId: action.payload.fieldId
    })
      return{
        ...state,
        subQuery: newSubQuery
      }
    
    case types.HANDLE_NEW_SUBQUERY_TOGGLE:
      if(!!state.subQuery.returnFields[action.payload.fieldId]){
        newReturnFields = Object.assign({}, state.subQuery.returnFields)
        delete newReturnFields[action.payload.fieldId];
        newSubQuery = Object.assign({}, state.subQuery, {returnFields: newReturnFields})
      } else {
        newReturnFields = Object.assign({}, state.subQuery.returnFields, {
          [action.payload.fieldId]: {
            fieldId: action.payload.fieldId, 
            tableId: action.payload.tableId
          }})
        newSubQuery = Object.assign({}, state.subQuery, {returnFields: newReturnFields})
      }
      return {
        ...state,
        subQuery: newSubQuery
      }

    case types.SUBMIT_SUBQUERY_HANDLER:
      let newSubQueryIndex = state.subQueryIndex;
      newSubQueryIndex += 1;

      newSubQuery = Object.assign({}, state.subQuery)
      newReturnQuery = Object.assign({}, state.newQuery)

      newReturnQuery.subQueries.push(newSubQuery);

      return {
        ...state,
        subQueryIndex : newSubQueryIndex,
        newQuery: newReturnQuery,
        subQuery: customQueryReset
      }
        default:
        return state;
      }
    };
    
    export default queryReducers;