import * as types from '../actions/action-types';

const initialState = {
  tableIndex: 0,
  tables: {},
  selectedTable: {
    type: '',
    fields: {},
    fieldsIndex: 1,
    tableID: -1,
  },
  selectedField : {
    name: '',
    type: 'String',
    primaryKey: false,
    unique: false,
    defaultValue: '',
    required: false,
    multipleValues: false,
    relationIndex: 0,
    relation: {},
    refrencees: {},
    tableNum: -1,
    fieldNum: -1
  },
  selectedRelation: {
    type: '',
    idRequested: false,
    fields: {},
    fieldsIndex: 0,
    tableID: -1,
  },
};

const reducers = (state = initialState, action) => {
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
    relation: {
      type: '',
      field: '',
      refType: ''
    },
    tableNum: -1,
    fieldNum: -1
  }
  const relationReset = {
    type: '',
    field: '',
    refType: '',
    tableId: -1,
    fieldId: -1
  }
  const idDefault = {
    name: 'id',
    type: 'ID',
    primaryKey: false,
    unique: true,
    defaultValue: '',
    required: false,
    multipleValues: false,
    relationIndex: 0,
    relation: {},
    tableNum: -1,
    fieldNum: 0
  }
  const mongoTable = Object.assign({}, tableReset, {
    fields: {
      0: Object.assign({}, idDefault, { tableNum: state.tableIndex })
    }
  })

  // action.payload is how you can access the info
  switch(action.type) {

        // ------------- Format to mongo onload -------------------//
        case types.TABLES_TO_MONGO_FORMAT:

        return {
          ...state,
          selectedTable: mongoTable
        }

          // ----------- Open Table Creator --------------//
    
    case types.OPEN_TABLE_CREATOR:
      newState = Object.assign({}, state)
      newState.selectedField = Object.assign({}, fieldReset)
      newState.selectedTable = Object.assign({}, tableReset) 
    return newState

                    // ------------- Add Table ----------------//
    case types.SAVE_TABLE_DATA_INPUT:
        if (state.selectedTable.tableID < 0) {
          //SAVE A NEW TABLE
          newTableData.tableID = state.tableIndex

          newTables = Object.assign({}, state.tables, {[state.tableIndex]: newTableData})
          newState = Object.assign({}, state, {
            tableIndex: state.tableIndex + 1,
            tables: newTables,
            selectedTable: tableReset,
          })
        } else {
          //UPDATE A SAVED TABLE
          newTables = Object.assign({}, state.tables, {[state.selectedTable.tableID]: newTableData})
          newState = Object.assign({}, state, {
            tables: newTables,
            selectedTable: tableReset,
          })
        }
          
    return {
      ...state,
      tables: newTables
    }

                    // ------------ Change Table Name ----------------//
    case types.HANDLE_TABLE_NAME_CHANGE:
      newSelectedTable = Object.assign({}, state.selectedTable, {type: action.payload})

      return {
      ...state,
      selectedTable: newSelectedTable
    }

                    // ------------ Change Table ID ----------------//
    case types.HANDLE_TABLE_ID:

      if (state.selectedField.fields[0]) {
        newSelectedField = Object.assign({}, state.selectedField.fields);
        delete newSelectedField[0]
      } else {
        newSelectedField = Object.assign({}, state.selectedField.fields, { 0: idDefault});
      }

      return {
      ...state,
      selectedField: newSelectedField
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

      // remove whitespace
      newSelectedFieldName = newSelectedFieldName.replace(/[^\w]/gi, '');

      // get list of field indexes, and alert if field name already exists in the table
      const listFieldIndexes = Object.getOwnPropertyNames(state.tables[state.selectedField.tableNum].fields);
      
      //remove the field from list of fields if updating to prevent snackbar from displaying field error
      if(state.selectedField.fieldNum !== -1){
        listFieldIndexes.splice(listFieldIndexes.indexOf(String(state.selectedField.fieldNum)),1);
      }

      if(newSelectedFieldName.length > 0) {
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
      }
      return state;

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

    default:
      return state;
  }
};

export default reducers;