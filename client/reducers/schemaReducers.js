import * as types from '../actions/action-types';

const initialState = {
  appSelected: '',
  tables: {},
  database: '',
  tableIndex: 0,
  tableCount: 0,
  fieldCount: 0,
  addFieldClicked: false,
  tableIndexSelected: null,
  selectedField : {
    name: '',
    type: 'String',
    primaryKey: 'False',
    unique: 'False',
    defaultValue: '',
    required: 'False',
    multipleValues: 'False',
    relation: 'False',
    tableNum: -1,
    fieldNum: -1
  },

  fieldUpdated: 0
};

const marketsReducer = (state = initialState, action) => {
  let appSelected = state.appSelected;
  let tables = state.tables;
  let tableIndex = state.tableIndex;
  let database = state.database;
  let tableCount = state.tableCount;
  let fieldCount = state.fieldCount;
  let addFieldClicked = state.addFieldClicked;
  let tableIndexSelected = state.tableIndexSelected;
  let selectedField = state.selectedField;
  let fieldUpdated = state.fieldUpdated;
  let newSelectedField;

  // action.payload is how you can access the info
  switch(action.type) {
    // Choose Database
    case types.CHOOSE_DATABASE:
      database = action.payload; 
      return {
        ...state,
        database
      }

    // Add Schema Table
    case types.ADD_TABLE:
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
      addFieldClicked = false;

      return {
        ...state,
        tables,
        tableIndex,
        tableCount,
        addFieldClicked
      };

    // toggle between the different apps: Schema, Query, and Code
    case types.CHOOSE_APP:
      appSelected = action.payload;
      return {
        ...state,
        appSelected
      }

    
    // Delete Schema Table
    case types.DELETE_TABLE:
      tableCount -= 1;
      addFieldClicked = false;
      delete tables[action.payload]
      return {
        ...state,
        tables,
        tableIndex,
        tableCount,
        addFieldClicked
      };

    // Add Field
    case types.ADD_FIELD:
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
    return {
      ...state,
      tables,
      fieldCount
    };

    // Update Field
    case types.UPDATE_FIELD:
      const currentFieldIndex = state.tables[state.selectedField.tableNum].fieldsIndex;
      const newSelectField = Object.assign({}, selectedField, {fieldNum: currentFieldIndex})
      let updatedTables = {}
      if (state.selectedField.fieldNum < 0) {

        updatedTables = 
        Object.assign({}, state.tables, {[state.selectedField.tableNum]:
          Object.assign({}, state.tables[state.selectedField.tableNum], {fieldsIndex: currentFieldIndex + 1}, {
            fields: Object.assign({}, state.tables[state.selectedField.tableNum].fields, {[currentFieldIndex]: 
              Object.assign({}, state.selectedField, {fieldNum: currentFieldIndex})})})})

      } else {
        updatedTables = 
        Object.assign({}, state.tables, {[state.selectedField.tableNum]:
          Object.assign({}, state.tables[state.selectedField.tableNum], {fieldsIndex: currentFieldIndex}, {
            fields: Object.assign({}, state.tables[state.selectedField.tableNum].fields, {[state.selectedField.fieldNum]: 
              Object.assign({}, state.selectedField, {fieldNum: currentFieldIndex})})})})        
      } 
      return {
        ...state,
        tables: updatedTables,
        selectedField: newSelectField,
        addFieldClicked,
        fieldUpdated
      } 

    case types.HANDLE_FIELDS_UPDATE:
    newSelectedField = Object.assign({}, state.selectedField, {[action.payload.name]: [action.payload.value]})
    return {
      ...state,
      tables,
      selectedField: newSelectedField,
      addFieldClicked,
      fieldUpdated
    }  

    case types.HANDLE_FIELDS_SELECT: 
    console.log('payload: ', action.payload);
    const location = action.payload.location.split(" ")

    newSelectedField = Object.assign({}, state.tables[Number(location[0])].fields[Number(location[1])]);
    return {
      ...state,
      tables,
      selectedField: newSelectedField,
      addFieldClicked,
      fieldUpdated
    }  

    // Add Field in Table was clicked to display field options
    case types.ADD_FIELD_CLICKED:
      addFieldClicked = true;
      newSelectedField = {
        name: '',
        type: 'String',
        primaryKey: 'False',
        unique: 'False',
        defaultValue: '',
        required: 'False',
        multipleValues: 'False',
        relation: 'False',
        tableNum: action.payload,
        fieldNum: -1
      };

      return{
        ...state,
        addFieldClicked,
        tableIndexSelected,
        selectedField: newSelectedField
      }

    default:
      return state;
  }
};

export default marketsReducer;