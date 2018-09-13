import * as types from '../actions/action-types';

const initialState = {
  tables: {},
  tableIndex: 0,
  fieldIndex: 0,
  database: ''
};

const marketsReducer = (state = initialState, action) => {
  let tables = state.tables;
  let tableIndex = state.tableIndex;
  let fieldIndex = state.fieldIndex;
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
      const newTable = action.payload;
      tables[tableIndex] = {};
      tables[tableIndex].name = newTable;
      tables[tableIndex].fields = {};
      tables[tableIndex].fields[fieldIndex] = {};
      tables[tableIndex].fields[fieldIndex].type = '';
      tables[tableIndex].fields[fieldIndex].primaryKey = false;
      tables[tableIndex].fields[fieldIndex].unique = false;
      tables[tableIndex].fields[fieldIndex].defaultValue = '';
      tables[tableIndex].fields[fieldIndex].multipleValue = false;
      tables[tableIndex].fields[fieldIndex].allowNulls = 'false';
      tables[tableIndex].fields[fieldIndex].relation = {};
      tableIndex += 1;
      console.log(`table ${newTable} was added`);
      console.log(tables);
      return {
        ...state,
        tables,
        tableIndex
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