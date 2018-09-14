import * as types from '../actions/action-types';

const initialState = {
  tables: {},
  tableIndex: 0,
  database: '',
  tableCount: 0
};

const marketsReducer = (state = initialState, action) => {
  let tables = state.tables;
  let tableIndex = state.tableIndex;
  let database = state.database;
  let tableCount = state.tableCount;

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
      const newTable = action.payload.name;
      const uniqueID = action.payload.uniqueID;
      tables[tableIndex] = {};
      tables[tableIndex].tableName = newTable;
      tables[tableIndex].idRequested = uniqueID;
      tables[tableIndex].fields = {};
      tables[tableIndex].fieldsIndex = 0;
      tableIndex += 1;
      tableCount += 1; 
      console.log(`table ${newTable} was added`);
      console.log('here are the tables: ', tables);
      return {
        ...state,
        tables,
        tableIndex,
        tableCount
      };
    
    // Delete Schema Table
    case types.DELETE_TABLE:
    tableCount -= 1
    delete tables[action.payload]
    console.log('here are the tables now', tables)
    return {
      ...state,
      tables,
      tableIndex,
      tableCount
    };

    // Add Field
    case types.ADD_FIELD:
    // tables[tableIndex].fields[0] = {};
    // tables[tableIndex].fields[0].type = '';
    // tables[tableIndex].fields[0].primaryKey = false;
    // tables[tableIndex].fields[0].unique = false;
    // tables[tableIndex].fields[0].defaultValue = '';
    // tables[tableIndex].fields[0].multipleValue = false;
    // tables[tableIndex].fields[0].allowNulls = 'false';
    // tables[tableIndex].fields[0].relation = {};
      console.log('this is action.payload', action.payload)
    return {
      ...state
    };

    // Delete Field
    case types.DELETE_FIELD:
      console.log(action.payload)

    return {
      ...state
    };

    default:
      return state;
  }
};

export default marketsReducer;