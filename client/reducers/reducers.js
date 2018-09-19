import * as types from '../actions/action-types';

const initialState = {
  queryMode: 'create',
  createTableState: true,
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
    relation: {
      type: '',
      field: '',
      refType: ''
    },
    tableNum: -1,
    fieldNum: -1
  },
  fieldUpdated: 0
};

const reducers = (state = initialState, action) => {
  let createTableState = state.createTableState;
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
    // ------------------------------ Welcome  ----------------------------//

    // Choose Database
    case types.CHOOSE_DATABASE:
      database = action.payload; 
      return {
        ...state,
        database
      }
    
    // ------------------------------ NavBar  ----------------------------//

    // Open Table Creator
    case types.OPEN_TABLE_CREATOR:
      console.log('opening table', action.payload)
      createTableState = action.payload
    return {
      ...state,
      createTableState
    }

    // ----------------------------- Schema App --------------------------------//

  
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
        createTableState,
        tables,
        tableIndex,
        tableCount,
        addFieldClicked
      };
    
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
      const selectedTableIndex = state.selectedField.tableNum;
      const currentFieldIndex = state.tables[selectedTableIndex].fieldsIndex;
      let updatedTables = {}

      // no field has been selected yet
      if (state.selectedField.fieldNum < 0) {
        updatedTables = 
        Object.assign({}, state.tables, {[selectedTableIndex]:
          Object.assign({}, state.tables[selectedTableIndex], {fieldsIndex: currentFieldIndex + 1}, {
            fields: Object.assign({}, state.tables[selectedTableIndex].fields, {[currentFieldIndex]: 
              Object.assign({}, state.selectedField, {fieldNum: currentFieldIndex})})})})
      } 
      // field has been selected
      else {
        updatedTables = 
        Object.assign({}, state.tables, {[selectedTableIndex]:
          Object.assign({}, state.tables[selectedTableIndex], {fieldsIndex: currentFieldIndex}, {
            fields: Object.assign({}, state.tables[selectedTableIndex].fields, {[state.selectedField.fieldNum]: 
              // Object.assign({}, state.selectedField, {fieldNum: currentFieldIndex})})})})        
              Object.assign({}, state.selectedField, {fieldNum: state.selectedField.fieldNum})})})})        
      } 

      const fieldReset = Object.assign({}, selectedField, 
          {name: '',
          type: 'String',
          primaryKey: 'False',
          unique: 'False',
          defaultValue: '',
          required: 'False',
          multipleValues: 'False',
          relation: {
            type: '',
            field: '',
            refType: ''
          },
          fieldNum: -1
        })
      return {
        ...state,
        tables: updatedTables,
        selectedField: fieldReset
      } 

    case types.HANDLE_FIELDS_UPDATE:
    // parse if relations field is selected
    if(action.payload.name.indexOf('.') !== -1){
      const rel = action.payload.name.split('.'); 
      newSelectedField = Object.assign({}, state.selectedField, {[rel[0]] :
                          Object.assign({}, state.selectedField[rel[0]], {[rel[1]] : [action.payload.value]})})
    } else{
      newSelectedField = Object.assign({}, state.selectedField, {[action.payload.name]: [action.payload.value]})
    }
    return {
      ...state,
      selectedField: newSelectedField
    }  

    // when a user selects a field, it changes selectedField to be an object with the necessary 
    // info from the selected table and field. 
    case types.HANDLE_FIELDS_SELECT: 
    // location contains the table index at [0], and field at [1]
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
      createTableState = false; 
      addFieldClicked = true;
      newSelectedField = {
        name: '',
        type: 'String',
        primaryKey: 'False',
        unique: 'False',
        defaultValue: '',
        required: 'False',
        multipleValues: 'False',
        relation: {
          type: '',
          field: '',
          refType: ''
        },
        tableNum: action.payload,
        fieldNum: -1
      };

      return{
        ...state,
        createTableState,
        addFieldClicked,
        tableIndexSelected,
        selectedField: newSelectedField
      }


      // ----------------------------- Query App -------------------------------//
    
    case types.CREATE_QUERY:
      console.log(action.payload)

    default:
      return state;
  }
};

export default reducers;