import * as types from '../actions/action-types';

const initialState = {
  tables: {},
  tableIndex: 0,
  database: '',
  tableCount: 0,
  addFieldClicked: false,
  tableIndexSelected: undefined
};

const marketsReducer = (state = initialState, action) => {
  let tables = state.tables;
  let tableIndex = state.tableIndex;
  let database = state.database;
  let tableCount = state.tableCount;
  let addFieldClicked = state.addFieldClicked;
  let tableIndexSelected = state.tableIndexSelected;

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
      tables[tableIndex].fieldsCount = 0;
      tables[tableIndex].tableID = state.tableIndex;
      tableIndex += 1;
      tableCount += 1; 
      console.log(`table ${newTable} was added`);
      console.log('here are the tables: ', tables);
      return {
        ...state,
        tables,
        tableIndex,
        tableCount,
      };
    
    // Delete Schema Table
    case types.DELETE_TABLE:
      tableCount -= 1;
      addFieldClicked = false;
      delete tables[action.payload]
      console.log('here are the tables now', tables)
      return {
        ...state,
        tables,
        tableIndex,
        tableCount,
        addFieldClicked
      };

    // Add Field
    case types.ADD_FIELD:
      let fieldsIndex = tables[tablesIndexSelected].fieldsIndex;
      addFieldClicked = false;
      tables[tablesIndexSelected].fieldsIndex += 1
      tables[tablesIndexSelected].fieldsCount += 1
      tables[tablesIndexSelected].fields[fieldsIndex] = {};
      tables[tablesIndexSelected].fields[fieldsIndex].name = action.payload.name;
      tables[tablesIndexSelected].fields[fieldsIndex].type = action.payload.type;
      tables[tablesIndexSelected].fields[fieldsIndex].primaryKey = action.payload.primaryKey;
      tables[tablesIndexSelected].fields[fieldsIndex].unique = action.payload.unique;
      tables[tablesIndexSelected].fields[fieldsIndex].defaultValue = action.payload.defaultValue;
      tables[tablesIndexSelected].fields[fieldsIndex].multipleValues = action.payload.multipleValues;
      tables[tablesIndexSelected].fields[fieldsIndex].required = action.payload.required;
      tables[tablesIndexSelected].fields[fieldsIndex].relations = action.payload.relations;
    return {
      ...state, 
      tables,
      addFieldClicked
    };

    // Delete Field
    case types.DELETE_FIELD:
      const indexes = action.payload
      const tablesIndexSelected = indices[0]
      const fieldIndexSelected = indexes[1]
      delete tables[tablesIndexSelected].fields[fieldIndexSelected]
      console.log('here are the fields now', tables[tablesIndexSelected].fields)
    return {
      ...state,
      tables
    };

    // Add Field in Table was clicked to display field options
    case types.ADD_FIELD_CLICKED:
      const tableIndexSelected = action.payload;
      addFieldClicked = true;
      
      return{
        ...state,
        addFieldClicked,
        tableIndexSelected
      }

    default:
      return state;
  }
};

export default marketsReducer;