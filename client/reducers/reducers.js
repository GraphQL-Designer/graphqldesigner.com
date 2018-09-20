import * as types from '../actions/action-types';

const initialState = {
  queryMode: 'create',
  createTableState: true,
  tables: {},
  database: '',
  tableIndex: 0,
  tableCount: 0,
  selectedField : {
    name: '',
    type: 'String',
    primaryKey: false,
    unique: false,
    defaultValue: '',
    required: false,
    multipleValues: false,
    relation: {
      type: '',
      field: '',
      refType: ''
    },
    tableNum: -1,
    fieldNum: -1
  },
  fieldUpdated: 0,
  selectedTableIndex: '',
  selectedTable: {
    type: '',
    idRequested: false,
    fields: {},
    fieldsIndex: 0,
    tableID: -1,
  }
};

const reducers = (state = initialState, action) => {
  let createTableState = state.createTableState;
  let appSelected = state.appSelected;
  let tables = state.tables;
  let tableIndex = state.tableIndex;
  let database = state.database;
  let tableCount = state.tableCount;
  let selectedField = state.selectedField;
  let fieldUpdated = state.fieldUpdated;
  let newSelectedField;
  let newSelectedTable;
  let newState;

  // action.payload is how you can access the info
  switch(action.type) {
    // ------------------------------ Welcome  ----------------------------//

    // Choose Database
    case types.CHOOSE_DATABASE:
      database = action.payload; 
      newSelectedTable = Object.assign({}, state.selectedTable, {idRequested: database === 'MongoDB'})

      return {
        ...state,
        database, 
        selectedTable: newSelectedTable
      }
    

    // ----------------------------- Schema App --------------------------------//

    // Open Table Creator
    case types.OPEN_TABLE_CREATOR:
      console.log('opening table', action.payload)
      createTableState = true
      selectedField.tableNum = -1
    return {
      ...state,
      createTableState,
      selectedField
    }

    // ----------------------------- Schema App --------------------------------//
    case types.HANDLE_TABLE_NAME_CHANGE:
      newSelectedTable = Object.assign({}, state.selectedTable, {type: action.payload})

      return {
      ...state,
      selectedTable: newSelectedTable
    }

    case types.HANDLE_TABLE_ID:
      newSelectedTable = Object.assign({}, state.selectedTable, {idRequested: !state.selectedTable.idRequested})

      return {
      ...state,
      selectedTable: newSelectedTable
    }
    // Add Schema Table
    case types.SAVE_TABLE_DATA_INPUT:
      let newState;
      if(state.selectedTable.tableID < 0){
        const newTableData = Object.assign({}, state.selectedTable, {tableID: state.tableIndex})
        const newTables = Object.assign({}, state.tables, {[state.tableIndex]: newTableData})
        newState = Object.assign({}, state, {
          tableIndex: state.tableIndex + 1,
          tableCount: state.tableCount + 1,
          tables: newTables,
          selectedTable: {
            type: '',
            idRequested: false || state.database === 'MongoDB',
            fields: {},
            fieldsIndex: 0,
            tableID: -1,
          }
        })
      } else {
        const newTableData = Object.assign({}, state.selectedTable)
        const newTables = Object.assign({}, state.tables, {[state.selectedTable.tableID]: newTableData})
        newState = Object.assign({}, state, {
          tables: newTables,
          selectedTable: {
            type: '',
            idRequested: false || state.database === 'MongoDB',
            fields: {},
            fieldsIndex: 0,
            tableID: -1,
          }
        })
      }
      return newState
      
    case types.HANDLE_SELECTED_TABLE:
      newSelectedTable = state.tables[action.payload]
      newState = Object.assign({}, state, {selectedTable: newSelectedTable})
      return newState;

    // Delete Schema Table
    case types.DELETE_TABLE:
      tableCount -= 1;
      delete tables[action.payload]
      return {
        ...state,
        tables,
        tableIndex,
        tableCount,
      };

    // Delete Field
    case types.DELETE_FIELD:
      const tablesIndexSelected = action.payload[0];
      const fieldIndexSelected = action.payload[1];
      delete tables[tablesIndexSelected].fields[fieldIndexSelected];
    return {
      ...state,
      tables,
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
          primaryKey: false,
          unique: false,
          defaultValue: '',
          required: false,
          multipleValues: false,
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
                          Object.assign({}, state.selectedField[rel[0]], {[rel[1]] : action.payload.value})})
    } else{
      if (action.payload.value === 'true') action.payload.value = true;
      if (action.payload.value === 'false') action.payload.value = false;
      newSelectedField = Object.assign({}, state.selectedField, {[action.payload.name]: action.payload.value})
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
      fieldUpdated
    }  

    // Add Field in Table was clicked to display field options
    case types.ADD_FIELD_CLICKED:
      createTableState = false; 
      newSelectedField = {
        name: '',
        type: 'String',
        primaryKey: false,
        unique: false,
        defaultValue: '',
        required: false,
        multipleValues: false,
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