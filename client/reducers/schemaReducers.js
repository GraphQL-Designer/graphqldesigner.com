import * as types from '../actions/action-types';

const initialState = {
  tables: {},
  tableIndex: 0,
  database: '',
  tableCount: 0,
  addFieldClicked: false,
  tableIndexSelected: null,
  selectedField : {}
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
      console.log('tableselected: ', tableIndexSelected);
      console.log('selected: ', tables[tableIndexSelected]);
      let fieldsIndex = tables[tableIndexSelected].fieldsIndex;
      addFieldClicked = false;
      tables[tableIndexSelected].fields[fieldsIndex] = {};
      tables[tableIndexSelected].fields[fieldsIndex].name = action.payload.name;
      tables[tableIndexSelected].fields[fieldsIndex].type = action.payload.type;
      tables[tableIndexSelected].fields[fieldsIndex].primaryKey = action.payload.primaryKey;
      tables[tableIndexSelected].fields[fieldsIndex].unique = action.payload.unique;
      tables[tableIndexSelected].fields[fieldsIndex].defaultValue = action.payload.defaultValue;
      tables[tableIndexSelected].fields[fieldsIndex].multipleValues = action.payload.multipleValues;
      tables[tableIndexSelected].fields[fieldsIndex].required = action.payload.required;
      tables[tableIndexSelected].fields[fieldsIndex].relations = action.payload.relations;
      tables[tableIndexSelected].fieldsIndex += 1;

      console.log('table is: ', tables);
    return {
      ...state, 
      tables,
      addFieldClicked
    };

    // Delete Field
    case types.DELETE_FIELD:
      console.log(action.payload)

    return {
      ...state
    };

    // Add Field in Table was clicked to display field options
    case types.ADD_FIELD_CLICKED:
      tableIndexSelected = action.payload;
      addFieldClicked = true;
      console.log('table index selected: ', tableIndexSelected);
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