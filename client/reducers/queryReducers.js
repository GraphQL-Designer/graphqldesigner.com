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

  let subQueryIndex = state.subQueryIndex;
  let newReturnFields;
  let newReturnQuery;
  let newSubQuery;
  let tempNewQuery;
  let newSubQueries;

  switch (action.type) {
    case types.CREATE_QUERY: 
      const newQuery = Object.assign({}, action.payload)
      
      return{
        ...state,
        queryMode: 'customQuery',
        selectedQuery: newQuery
      }
    
    case types.OPEN_CREATE_QUERY:

      return {
        ...state,
        queryMode: 'create',
        selectedQuery: customQueryReset
      }
    
    case types.HANDLE_NEW_QUERY_NAME:
      tempNewQuery = Object.assign({}, state.newQuery, 
        {name: action.payload.value})
      
      return{
        ...state,
        newQuery: tempNewQuery
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
        let { subQueryIndex, fieldIndex, tableIndex, returnFieldsIndex } = action.payload;
        if(subQueryIndex < 0) {
          if(!!state.newQuery.returnFields[fieldIndex]) {
            newReturnFields = Object.assign({}, state.newQuery.returnFields)
            delete newReturnFields[fieldIndex];
            newReturnQuery = Object.assign({}, state.newQuery, {returnFields: newReturnFields})
          } else {
            newReturnFields = Object.assign({}, state.newQuery.returnFields, {[fieldIndex]: {fieldIndex, tableIndex}})
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

        case types.HANDLE_NEW_QUERY_CHANGE:
          tempNewQuery = Object.assign({}, state.newQuery, 
            {[action.payload.name]: action.payload.value})
          
          return{
            ...state,
            newQuery: tempNewQuery
          }
        

        case types.HANDLE_SUBQUERY_SELECTOR:
        newSubQuery = Object.assign({}, state.subQuery, {
          tableIndex: action.payload.tableIndex,
          fieldIndex: action.payload.fieldIndex
        })
          return{
            ...state,
            subQuery: newSubQuery
          }
        
        case types.HANDLE_NEW_SUBQUERY_TOGGLE:
          if(!!state.subQuery.returnFields[action.payload.fieldIndex]){
            newReturnFields = Object.assign({}, state.subQuery.returnFields)
            delete newReturnFields[action.payload.fieldIndex];
            newSubQuery = Object.assign({}, state.subQuery, {returnFields: newReturnFields})
          } else {
            newReturnFields = Object.assign({}, state.subQuery.returnFields, {
              [action.payload.fieldIndex]: {
                fieldIndex: action.payload.fieldIndex, 
                tableIndex: action.payload.tableIndex
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
    