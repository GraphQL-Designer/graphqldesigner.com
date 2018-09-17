import * as types from '../actions/action-types';

const initialState = {
  tables: {},
  database: '',
  tableIndex: 0,
  tableCount: 0,
  fieldCount: 0,
  addFieldClicked: false,
  tableIndexSelected: null,
  selectedField : {}
};

const marketsReducer = (state = initialState, action) => {
  let tables = state.tables;
  let tableIndex = state.tableIndex;
  let database = state.database;
  let tableCount = state.tableCount;
  let fieldCount = state.fieldCount;
  let addFieldClicked = state.addFieldClicked;
  let tableIndexSelected = state.tableIndexSelected;
  let selectedField = state.selectedField;
  console.log('tables IS: ', tables);
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
    console.log('tableIndex: ', tableIndex);
      const newTable = action.payload.name;
      const uniqueID = action.payload.uniqueID;
      tables[tableIndex] = {};
      tables[tableIndex].type = newTable;
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
      console.log('selected table: ', tables[tableIndexSelected]);
      let fieldsIndex = tables[tableIndexSelected].fieldsIndex;
      addFieldClicked = false;
      fieldCount += 1;
      selectedField = {};

      tables[tableIndexSelected].fieldsIndex += 1;
      tables[tableIndexSelected].fields[fieldsIndex] = {};
      tables[tableIndexSelected].fields[fieldsIndex].name = action.payload.name;
      tables[tableIndexSelected].fields[fieldsIndex].type = action.payload.type;
      tables[tableIndexSelected].fields[fieldsIndex].primaryKey = action.payload.primaryKey;
      tables[tableIndexSelected].fields[fieldsIndex].unique = action.payload.unique;
      tables[tableIndexSelected].fields[fieldsIndex].defaultValue = action.payload.defaultValue;
      tables[tableIndexSelected].fields[fieldsIndex].multipleValues = action.payload.multipleValues;
      tables[tableIndexSelected].fields[fieldsIndex].required = action.payload.required;
      tables[tableIndexSelected].fields[fieldsIndex].relations = action.payload.relations;
      console.log('tables: ', tables);
    return {
      ...state, 
      tables,
      fieldCount,
      addFieldClicked,
      selectedField
    };

    // Delete Field
    case types.DELETE_FIELD:
      fieldCount -= 1; 
      const tablesIndexSelected = action.payload[0];
      const fieldIndexSelected = action.payload[1];
      delete tables[tablesIndexSelected].fields[fieldIndexSelected];
      console.log('here are the fields now', tables[tablesIndexSelected].fields)
    return {
      ...state,
      tables,
      fieldCount
    };

    // Update Field
    case types.UPDATE_FIELD:
    let tableIndexUpdate = action.payload.tableIndex;
    let fieldIndexUpdate = action.payload.fieldIndex;
    addFieldClicked = true;

    selectedField = {
      name : tables[tableIndexUpdate].fields[fieldIndexUpdate].name,
      type : tables[tableIndexUpdate].fields[fieldIndexUpdate].type,
      primaryKey : tables[tableIndexUpdate].fields[fieldIndexUpdate].primaryKey,
      unique : tables[tableIndexUpdate].fields[fieldIndexUpdate].unique,
      defaultValue : tables[tableIndexUpdate].fields[fieldIndexUpdate].defaultValue,
      multipleValues : tables[tableIndexUpdate].fields[fieldIndexUpdate].multipleValues,
      required : tables[tableIndexUpdate].fields[fieldIndexUpdate].required,
      tableIndex: tableIndexUpdate,
      fieldIndex: fieldIndexUpdate
    };

    if(action.payload.submitUpdate){
      tables[tableIndexUpdate].fields[fieldIndexUpdate].name = action.payload.name;
      tables[tableIndexUpdate].fields[fieldIndexUpdate].type = action.payload.type;
      tables[tableIndexUpdate].fields[fieldIndexUpdate].primaryKey = action.payload.primaryKey;
      tables[tableIndexUpdate].fields[fieldIndexUpdate].unique = action.payload.unique;
      tables[tableIndexUpdate].fields[fieldIndexUpdate].defaultValue = action.payload.defaultValue;
      tables[tableIndexUpdate].fields[fieldIndexUpdate].multipleValues = action.payload.multipleValues;
      tables[tableIndexUpdate].fields[fieldIndexUpdate].required = action.payload.required;
      addFieldClicked = false;
    }

    return {
      ...state,
      ...tables,
      selectedField,
      addFieldClicked
    }  


    // Add Field in Table was clicked to display field options
    case types.ADD_FIELD_CLICKED:
      tableIndexSelected = action.payload;
      addFieldClicked = true;
      selectedField = {};
      console.log('table index selected: ', tableIndexSelected);
      return{
        ...state,
        addFieldClicked,
        tableIndexSelected,
        selectedField
      }

    default:
      return state;
  }
};

export default marketsReducer;