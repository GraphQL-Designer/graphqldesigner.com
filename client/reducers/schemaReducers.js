import * as types from '../actions/action-types';

const initialState = {
  tables: {},
  database: ''
};

const marketsReducer = (state = initialState, action) => {
  let tables = state.tables;
  let database = state.database

  // action.payload is how you can access the info
  switch(action.type) {
    // Choose Database
    case types.CHOOSE_DATABASE:
      database = action.payload; 
      console.log('this database was just selected: ', database)
      return {
        ...state,
        database
      }

    // Add Schema Table
    case types.ADD_TABLE:
      return {
        ...state,
      };
    
    // Delete Schema Table
    case types.DELETE_TABLE:
    return {
      ...state
    };

    // Add Field
    case types.ADD_FIELD:

    return {
      ...state
    };

    // Delete Field
    case types.DELETE_FIELD:

    return {
      ...state
    };

    default:
      return state;
  }
};

export default marketsReducer;