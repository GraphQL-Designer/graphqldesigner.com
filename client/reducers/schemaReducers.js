import * as types from '../actions/action-types';

const initialState = {
  queryMode: 'create',
  tables: {},
  tableIndex: 0,
  selectedField : {
    name: '',
    type: 'String',
    primaryKey: false,
    unique: false,
    defaultValue: '',
    required: false,
    multipleValues: false,
    relationSelected: false,
    relation: {
      type: '',
      field: '',
      refType: ''
    },
    tableNum: -1,
    fieldNum: -1
  },
  selectedTable: {
    type: '',
    idRequested: false,
    fields: {},
    fieldsIndex: 0,
    tableID: -1,
  },
};



const reducers = (state = initialState, action) => {
  // let database = state.database;
  let newSelectedField;
  let newSelectedTable;
  let newTables;
  let newTable;
  let newState;
  let tableNum;
  const tableReset = {
    type: '',
    idRequested:  false,
    fields: {},
    fieldsIndex: 0,
    tableID: -1,
  }
  const fieldReset = {
    name: '',
    type: 'String',
    primaryKey: false,
    unique: false,
    defaultValue: '',
    required: false,
    multipleValues: false,
    relationSelected: false,
    relation: {
      type: '',
      field: '',
      refType: ''
    },
    tableNum: -1,
    fieldNum: -1
  }

  // action.payload is how you can access the info
  switch(action.type) {

                  // ----------- Open Table Creator --------------//
    
    case types.OPEN_TABLE_CREATOR:
      newState = Object.assign({}, state)
      newState.selectedField = Object.assign({}, fieldReset)
      newState.selectedTable = Object.assign({}, tableReset) 
    return newState

                    // ------------- Add Table ----------------//
    case types.SAVE_TABLE_DATA_INPUT:
      let newTableData;
      newTableData = Object.assign({}, state.selectedTable)

      // Save a new table
      if (state.selectedTable.tableID < 0) {  // no table selected, aka save new table
        newTableData.tableID = state.tableIndex

        const newTables = Object.assign({}, state.tables, {[state.tableIndex]: newTableData})
        newState = Object.assign({}, state, {
          tableIndex: state.tableIndex + 1,
          tables: newTables,
          selectedTable: tableReset,
        })
      } 
      // Update table
      else {
        const newTables = Object.assign({}, state.tables, {[state.selectedTable.tableID]: newTableData})
        newState = Object.assign({}, state, {
          tables: newTables,
          selectedTable: tableReset,
        })
      }

      return newState

                    // ------------ Change Table Name ----------------//
    case types.HANDLE_TABLE_NAME_CHANGE:
      newSelectedTable = Object.assign({}, state.selectedTable, {type: action.payload})

      return {
      ...state,
      selectedTable: newSelectedTable
    }

                    // ------------ Change Table ID ----------------//
    case types.HANDLE_TABLE_ID:
      newSelectedTable = Object.assign({}, state.selectedTable, {idRequested: !state.selectedTable.idRequested})

      return {
      ...state,
      selectedTable: newSelectedTable
    }

                    // ---------- Select Table For Update ------------//
    case types.HANDLE_SELECTED_TABLE:
      tableNum = Number(action.payload)

      newSelectedTable = Object.assign({}, state.tables[tableNum])
      
      return {
        ...state,
        selectedTable: newSelectedTable,
        selectedField: fieldReset
        //selectedField: fieldReset //fieldReset is defined above the cases
      };

                    // --------------- Delete Table ----------------//
    case types.DELETE_TABLE:
    tableNum = Number(action.payload);

    newTables = Object.assign({}, state.tables);
    delete newTables[tableNum];

    if (state.selectedField.tableNum === tableNum) {
      return {
        ...state,
        tables: newTables,
        selectedTable: tableReset,
        selectedField: fieldReset
      }
    } else {
      if (state.selectedTable.tableID === tableNum) {
        return {
          ...state,
          tables: newTables,
          selectedTable: tableReset
        }
      } else {
        return {
          ...state,
          tables: newTables,
        }
      }
    }

                // ----------- Save Added or Updated Field ----------------//
    case types.SAVE_FIELD_INPUT:
      let newSelectedFieldName = state.selectedField.name;

      tableNum = state.selectedField.tableNum;
      const currentFieldIndex = state.tables[tableNum].fieldsIndex;
      // no field has been selected yet 
      if (state.selectedField.fieldNum < 0) {
        newTables = 
        Object.assign({}, state.tables, {[tableNum]:
          Object.assign({}, state.tables[tableNum], {fieldsIndex: currentFieldIndex + 1}, {
            fields: Object.assign({}, state.tables[tableNum].fields, {[currentFieldIndex]: 
              Object.assign({}, state.selectedField, {fieldNum: currentFieldIndex, name: newSelectedFieldName})})})})

              newSelectedField = Object.assign({}, fieldReset, {tableNum})
              return {
                ...state,
                tables: newTables,
                selectedField: newSelectedField,
              } 
      } 
      // field has been selected
      else {
        newTables = 
        Object.assign({}, state.tables, {[tableNum]:
          Object.assign({}, state.tables[tableNum], {fieldsIndex: currentFieldIndex}, {
            fields: Object.assign({}, state.tables[tableNum].fields, {[state.selectedField.fieldNum]: 
              Object.assign({}, state.selectedField, {fieldNum: state.selectedField.fieldNum, name: newSelectedFieldName})})})})  
              
              return {
                ...state,
                tables: newTables,
                selectedField: fieldReset
              } 
          } 

                     // -------------- Delete Field ----------------//
    case types.DELETE_FIELD:
      tableNum = Number(action.payload[0]);
      const fieldNum = Number(action.payload[1]);
      if (state.selectedField.tableNum === tableNum && state.selectedField.fieldNum === fieldNum) {

      newTable = Object.assign({}, state.tables[tableNum])
      delete newTable.fields[fieldNum];
      newTables = Object.assign({}, state.tables, {[tableNum]: newTable})

      return {
        ...state,
        tables: newTables,
        selectedField: fieldReset
      }
    } else {
      newTable = Object.assign({}, state.tables[tableNum])
      delete newTable.fields[fieldNum];
      newTables = Object.assign({}, state.tables, {[tableNum]: newTable})

      return {
        ...state,
        tables: newTables
      }
    }

                    // ------------ HANDLE FIELD UPDATE ----------------//
    // updates selected field on each data entry
    case types.HANDLE_FIELDS_UPDATE:
      // parse if relations field is selected
      if(action.payload.name.indexOf('.') !== -1){
        const rel = action.payload.name.split('.'); // rel[0] is 'relation' and rel[1] is either 'type', 'field', or 'ref'type'
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

                    // ------------ FIELD SELECTED FOR UPDATE ----------------//

    // when a user selects a field, it changes selectedField to be an object with the necessary 
    // info from the selected table and field. 
    case types.HANDLE_FIELDS_SELECT: 
      // location contains the table index at [0], and field at [1]
      const location = action.payload.location.split(" ")
  
      newSelectedField = Object.assign({}, state.tables[Number(location[0])].fields[Number(location[1])]);

    return {
      ...state,
      selectedField: newSelectedField,
      selectedTable: tableReset
    }  
                    // ------------ OPEN FIELD CREATOR ----------------//
    // Add Field in Table was clicked to display field options
    case types.ADD_FIELD_CLICKED:
      newSelectedField = fieldReset
      newSelectedField.tableNum = Number(action.payload)

      return{
        ...state,
        selectedField: newSelectedField
      }

                   // ------------ New Project ----------------//
      // User clicked New Project
      case types.HANDLE_NEW_PROJECT: 

        newState = Object.assign({}, initialState);
        
        return newState;
      
    default:
      return state;
  }
};

export default reducers;