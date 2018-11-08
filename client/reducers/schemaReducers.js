import * as types from '../actions/action-types';

const initialState = {
  database: '',
  projectReset: true,
  tableIndex: 0,
  tables: {},
  selectedTable: {
    type: '',
    fields: {},
    fieldsIndex: 1,
    tableID: -1,
  },
  selectedField: {
    name: '',
    type: 'String',
    primaryKey: false,
    autoIncrement: false,
    unique: false,
    defaultValue: '',
    required: false,
    multipleValues: false,
    relationSelected: false,
    relation: {
      tableIndex: -1,
      fieldIndex: -1,
      refType: '',
    },
    refBy: new Set(),
    tableNum: -1,
    fieldNum: -1,
  },
};

const reducers = (state = initialState, action) => {
  let newSelectedField;
  let newSelectedTable;
  let newTables;
  let newTable;
  let newState;
  let tableNum;
  let newTableData;
  let newFields;
  let refBy;

  const tableReset = {
    type: '',
    fields: {},
    fieldsIndex: 1,
    tableID: -1,
  };

  const fieldReset = {
    name: '',
    type: 'String',
    primaryKey: false,
    autoIncrement: false,
    unique: false,
    defaultValue: '',
    required: false,
    multipleValues: false,
    relationSelected: false,
    relation: {
      tableIndex: -1,
      fieldIndex: -1,
      refType: '',
    },
    refBy: new Set(),
    tableNum: -1,
    fieldNum: -1,
  };
  const relationReset = {
    tableIndex: -1,
    fieldIndex: -1,
    refType: '',
  };
  const idDefault = {
    name: 'id',
    type: 'ID',
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    defaultValue: '',
    required: false,
    multipleValues: false,
    relationSelected: false,
    relation: {
      tableIndex: -1,
      fieldIndex: -1,
      refType: '',
    },
    refByIndex: 0,
    refBy: new Set(),
    tableNum: -1,
    fieldNum: 0,
  };

  const mongoTable = Object.assign({}, tableReset, {
    fields: {
      0: Object.assign({}, idDefault, { type: 'String' }, { tableNum: state.tableIndex }),
    },
  });

  switch (action.type) {
    case 'CHOOSE_DATABASE':
      const database = action.payload;
      // go to the schema tab if they start a new project
      let selectedTable = state.selectedTable;
      if (database === 'MongoDB') {
        selectedTable = mongoTable;
      }

      return {
        ...state,
        database,
        selectedTable
      };

      // ----------------------------- Open Table Creator ---------------------------------//

    case types.OPEN_TABLE_CREATOR:
      newSelectedField = Object.assign({}, fieldReset);
      if (state.database === 'MongoDB') {
        newSelectedTable = Object.assign({}, mongoTable);
      } else {
        newSelectedTable = Object.assign({}, tableReset);
      }

      return {
        ...state,
        selectedTable: newSelectedTable,
        selectedField: newSelectedField,
      };

    // ------------------------------- Add Or Update Table -------------------------------//
    case types.SAVE_TABLE_DATA_INPUT:
      // SAVE A NEW TABLE
      if (state.selectedTable.tableID < 0) {
        newTable = Object.assign({}, state.selectedTable, { tableID: state.tableIndex });
        newTables = Object.assign({}, state.tables, { [state.tableIndex]: newTable });
        newState = Object.assign({}, state, {
          tableIndex: state.tableIndex + 1,
          tables: newTables,
          selectedTable: state.database === 'MongoDB' ? mongoTable : tableReset,
        });

        if (state.database === 'MongoDB') newState.selectedTable.fields[0].tableNum++;
      } 
      // UPDATE A SAVED TABLE
      else {
        newTableData = Object.assign({}, state.selectedTable);
        newTables = Object.assign({}, state.tables, { [state.selectedTable.tableID]: newTableData });
        newState = Object.assign({}, state, {
          tables: newTables,
          selectedTable: state.database === 'MongoDB' ? mongoTable : tableReset,
        });
      }

      return newState;

    // ---------------------------- Change Table Name -----------------------------------//
    case types.HANDLE_TABLE_NAME_CHANGE:
      newSelectedTable = Object.assign({}, state.selectedTable, { type: action.payload });

      return {
        ...state,
        selectedTable: newSelectedTable,
      };

    // ----------------------------- Change Table ID ---------------------------------//
    case types.HANDLE_TABLE_ID:
      // If table previously had unique ID, remove it
      if (!!state.selectedTable.fields[0]) {
        newFields = Object.assign({}, state.selectedTable.fields);
        delete newFields[0];
        newSelectedTable = Object.assign({}, state.selectedTable, { fields: newFields });
      } 
      // table did not previously have unique ID, add it
      else {
        newFields = Object.assign({}, state.selectedTable.fields, { 0: idDefault });
        // new table is being created, give it an unique ID
        if (state.selectedTable.tableID < 0) {
          newFields[0].tableNum = state.tableIndex;
        } 
        // table is being updated, and user clicked to add unique ID
        else {
          newFields[0].tableNum = state.selectedTable.tableID;
        }
        newSelectedTable = Object.assign({}, state.selectedTable, { fields: newFields });
      }

      return {
        ...state,
        selectedTable: newSelectedTable,
      };

    // -------------------------- Select Table For Update -----------------------------//
    case types.HANDLE_SELECTED_TABLE:
      tableNum = Number(action.payload);

      newSelectedTable = Object.assign({}, state.tables[tableNum]);

      return {
        ...state,
        selectedTable: newSelectedTable,
        selectedField: fieldReset,
      };

    // -------------------------------- Delete Table -------------------------------//
    case types.DELETE_TABLE:
      tableNum = Number(action.payload);

      // loop through table fields, and check for relations to delete in other fields
      for (let fieldNum in state.tables[tableNum].fields) {
        // Deleted field has relation. Delete reference in related field
        if (state.tables[tableNum].fields[fieldNum].relationSelected) {
          const relatedTableIndex = state.tables[tableNum].fields[fieldNum].relation.tableIndex;
          const relatedFieldIndex = state.tables[tableNum].fields[fieldNum].relation.fieldIndex;
          let relatedRefType = state.tables[tableNum].fields[fieldNum].relation.refType;
          if (relatedRefType === 'one to many') relatedRefType = 'many to one';
          else if (relatedRefType === 'many to one') relatedRefType = 'one to many';
          let refInfo = `${tableNum}.${fieldNum}.${relatedRefType}`;
          let deletedRefBy = state.tables[relatedTableIndex].fields[relatedFieldIndex].refBy;
          deletedRefBy = new Set(deletedRefBy);
          deletedRefBy.delete(refInfo);
          state.tables[relatedTableIndex].fields[relatedFieldIndex].refBy = deletedRefBy;
        }
        // Deleted field is being referenced by another field. Delete other field's relation
        refBy = state.tables[tableNum].fields[fieldNum].refBy;
        if (refBy.size > 0) {
          refBy.forEach((value) => {
            const refInfo = value.split('.');
            const relatedTableIndex = refInfo[0];
            const relatedFieldIndex = refInfo[1];
            const relatedField = state.tables[relatedTableIndex].fields[relatedFieldIndex];
            relatedField.relationSelected = false;
            relatedField.relation = relationReset;
          });
        }
      }

      newTables = Object.assign({}, state.tables);
      delete newTables[tableNum];

      if (state.database === 'MongoDB') {
        newSelectedTable = Object.assign({}, mongoTable);
      } else {
        newSelectedTable = Object.assign({}, tableReset);
      }

      if (state.selectedField.tableNum === tableNum) {
        return {
          ...state,
          tables: newTables,
          selectedTable: newSelectedTable,
          selectedField: fieldReset,
        };
      } else {
        if (state.selectedTable.tableID === tableNum) {
          return {
            ...state,
            tables: newTables,
            selectedTable: newSelectedTable,
          };
        } else {
          return {
            ...state,
            tables: newTables,
          };
        }
      }

    // ------------------------- Save Added or Updated Field ---------------------------//
    case types.SAVE_FIELD_INPUT:
      tableNum = state.selectedField.tableNum;
      let newSelectedFieldName = state.selectedField.name;
      const selectedFieldNum = state.selectedField.fieldNum;
      const currentFieldIndex = state.tables[tableNum].fieldsIndex;

      // variables for relations
      const relationSelected = state.selectedField.relationSelected;
      const newRelatedTableIndex = state.selectedField.relation.tableIndex;
      const newRelatedFieldIndex = state.selectedField.relation.fieldIndex;
      let newRelatedRefType = state.selectedField.relation.refType;
      // flip the RefType so the related ref type is representative of itself.
      if (newRelatedRefType === 'one to many') newRelatedRefType = 'many to one';
      else if (newRelatedRefType === 'many to one') newRelatedRefType = 'one to many';
      // Below 2 variables depend on if field is new or being updated
      let newRefInfo;
      let relationPreviouslySelected;
      if (selectedFieldNum < 0) {
        relationPreviouslySelected = false;
        newRefInfo = `${tableNum}.${currentFieldIndex}.${newRelatedRefType}`;
      } else {
        relationPreviouslySelected = state.tables[tableNum].fields[selectedFieldNum].relationSelected;
        newRefInfo = `${tableNum}.${selectedFieldNum}.${newRelatedRefType}`;
      }

      // relation selected. New field, or updating field with no previous relation. Add relation
      if ((selectedFieldNum < 0 || !relationPreviouslySelected) && relationSelected) {
        refBy = state.tables[newRelatedTableIndex].fields[newRelatedFieldIndex].refBy;
        refBy = new Set(refBy);
        refBy.add(newRefInfo);
        state.tables[newRelatedTableIndex].fields[newRelatedFieldIndex].refBy = refBy;
      }
      // field update, update relation to other field if changed
      else if (selectedFieldNum >= 0) {
        const prevRelatedTableIndex = state.tables[tableNum].fields[selectedFieldNum].relation.tableIndex;
        const prevRelatedFieldIndex = state.tables[tableNum].fields[selectedFieldNum].relation.fieldIndex;
        let newRefBy;
        // if relation toggled off, then newRefBy is a empty Set.
        if (newRelatedFieldIndex < 0) newRefBy = new Set();
        else newRefBy = state.tables[newRelatedTableIndex].fields[newRelatedFieldIndex].refBy;

        // relation changed, update the other fields (delete old if necessary, and add new)
        if (!newRefBy.has(newRefInfo)) {
          // A previous relation existed, delete it
          if (relationPreviouslySelected) {
            let prevRefBy = state.tables[prevRelatedTableIndex].fields[prevRelatedFieldIndex].refBy;
            let prevRelatedRefType = state.tables[tableNum].fields[selectedFieldNum].relation.refType;
            if (prevRelatedRefType === 'one to many') prevRelatedRefType = 'many to one';
            else if (prevRelatedRefType === 'many to one') prevRelatedRefType = 'one to many';
            const prevRefInfo = `${tableNum}.${selectedFieldNum}.${prevRelatedRefType}`;
            prevRefBy = new Set(prevRefBy);
            prevRefBy.delete(prevRefInfo);
            state.tables[prevRelatedTableIndex].fields[prevRelatedFieldIndex].refBy = prevRefBy;
            newRefBy = new Set(prevRefBy);
          }
          // relation selected, add relation infomation to other field
          if (relationSelected) {
            newRefBy = new Set(newRefBy);
            newRefBy.add(newRefInfo);
            state.tables[newRelatedTableIndex].fields[newRelatedFieldIndex].refBy = newRefBy;
          }
        }
      }

      // Save new field
      if (selectedFieldNum < 0) {
        newTables =
        Object.assign({}, state.tables, {[tableNum]:
          Object.assign({}, state.tables[tableNum], {fieldsIndex: currentFieldIndex + 1}, {
            fields: Object.assign({}, state.tables[tableNum].fields, {[currentFieldIndex]:
              Object.assign({}, state.selectedField, {fieldNum: currentFieldIndex, name: newSelectedFieldName})})})});

        newSelectedField = Object.assign({}, fieldReset, {tableNum});
        return {
          ...state,
          tables: newTables,
          selectedField: newSelectedField,
        };
      }

      // Save updated field
      else {
        newTables =
        Object.assign({}, state.tables, {[tableNum]:
          Object.assign({}, state.tables[tableNum], {fieldsIndex: currentFieldIndex}, {
            fields: Object.assign({}, state.tables[tableNum].fields, {[selectedFieldNum]:
              Object.assign({}, state.selectedField, {fieldNum: selectedFieldNum, name: newSelectedFieldName})})})});

        return {
          ...state,
          tables: newTables,
          selectedField: fieldReset,
        };
      }

    // ----------------------------- Delete Field -----------------------------------//
    case types.DELETE_FIELD:
      tableNum = Number(action.payload[0]);
      const fieldNum = Number(action.payload[1]);

      // Deleted field has relation. Delete reference in related field
      if (state.tables[tableNum].fields[fieldNum].relationSelected) {
        const relatedTableIndex = state.tables[tableNum].fields[fieldNum].relation.tableIndex;
        const relatedFieldIndex = state.tables[tableNum].fields[fieldNum].relation.fieldIndex;
        let relatedRefType = state.tables[tableNum].fields[fieldNum].relation.refType;
        if (relatedRefType === 'one to many') relatedRefType = 'many to one';
        else if (relatedRefType === 'many to one') relatedRefType = 'one to many';
        let refInfo = `${tableNum}.${fieldNum}.${relatedRefType}`;
        let deletedRefBy = state.tables[relatedTableIndex].fields[relatedFieldIndex].refBy;
        deletedRefBy = new Set(deletedRefBy);
        deletedRefBy.delete(refInfo);
        state.tables[relatedTableIndex].fields[relatedFieldIndex].refBy = deletedRefBy;
      }

      // Deleted field is being referenced by another field. Delete other field's relation
      refBy = state.tables[tableNum].fields[fieldNum].refBy;
      if (refBy.size > 0) {
        refBy.forEach((value) => {
          const refInfo = value.split('.');
          const relatedTableIndex = refInfo[0];
          const relatedFieldIndex = refInfo[1];
          const relatedField = state.tables[relatedTableIndex].fields[relatedFieldIndex];
          relatedField.relationSelected = false;
          relatedField.relation = relationReset;
        });
      }

      newTable = Object.assign({}, state.tables[tableNum]);
      delete newTable.fields[fieldNum];
      newTables = Object.assign({}, state.tables, { [tableNum]: newTable });
      newSelectedField = state.selectedField;

      // if you are deleting the field currently selected, reset selectedField
      if (state.selectedField.tableNum === tableNum && state.selectedField.fieldNum === fieldNum) {
        newSelectedField = fieldReset;
      }

      return {
        ...state,
        tables: newTables,
        selectedField: newSelectedField,
      };

      // -------------------------------- HANDLE FIELD UPDATE ---------------------------------//

    // updates selected field on each data entry
    case types.HANDLE_FIELDS_UPDATE:
      // parse if relations field is selected
      if (action.payload.name.indexOf('.') !== -1) {
        const rel = action.payload.name.split('.'); // rel[0] is 'relation' and rel[1] is either 'tableIndex', 'fieldIndex', or 'refType'
        newSelectedField = Object.assign({}, state.selectedField, {
          [rel[0]]: Object.assign({}, state.selectedField[rel[0]], {
            [rel[1]] : action.payload.value},
          ),
        });
      } else {
        if (action.payload.value === 'true') action.payload.value = true;
        if (action.payload.value === 'false') action.payload.value = false;
        newSelectedField = Object.assign({}, state.selectedField,
          {[action.payload.name]: action.payload.value}
        );
        // user toggled relation off
        if (action.payload.name === 'relationSelected' && action.payload.value === false){
          newSelectedField.relation = Object.assign({}, relationReset);
        }
      }
      return {
        ...state,
        selectedField: newSelectedField,
      };

      // --------------------------- FIELD SELECTED FOR UPDATE -------------------------------//
    // when a user selects a field, it changes selectedField to be an object with the necessary
    // info from the selected table and field.
    case types.HANDLE_FIELDS_SELECT:
      // location contains the table index at [0], and field at [1]
      const location = action.payload.location.split(' ');

      newSelectedField = Object.assign({}, state.tables[Number(location[0])].fields[Number(location[1])]);

      if (state.database === 'MongoDB') {
        newSelectedTable = Object.assign({}, mongoTable);
      } else {
        newSelectedTable = Object.assign({}, tableReset);
      }

      return {
        ...state,
        selectedTable: newSelectedTable,
        selectedField: newSelectedField,
      };

      // ----------------------------- OPEN FIELD CREATOR ----------------------------------//

    // Add Field in Table was clicked to display field options
    case types.ADD_FIELD_CLICKED:
      newSelectedField = fieldReset;
      newSelectedField.tableNum = Number(action.payload);

      return {
        ...state,
        selectedField: newSelectedField,
        selectedTable: tableReset
      };

      // ---------------------------------- New Project -------------------------------------//

    // User clicked New Project
    case types.HANDLE_NEW_PROJECT:
      newState = Object.assign({}, initialState, { projectReset: action.payload });
      document.getElementById('schemaTab').click();

      return newState;

    default:
      return state;
  }
};

export default reducers;
