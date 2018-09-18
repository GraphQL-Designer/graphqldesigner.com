import * as types from './action-types.js'
import table from '../components/schema/table.js';

export const chooseDatabase = (dbName) => ({
  type: types.CHOOSE_DATABASE,
  payload: dbName,
});

export const addTable = (tableIndex) => ({
  type: types.ADD_TABLE,
  payload: tableIndex,
});

export const deleteTable = (tableIndex) => ({
  type: types.DELETE_TABLE,
  payload: tableIndex,
});

export const addField = (fieldName) => ({
  type: types.ADD_FIELD,
  payload: fieldName,
});

export const deleteField = (tableIndex) => ({
  type: types.DELETE_FIELD,
  payload: tableIndex
});

export const addFieldClicked = (tableIndex) => ({
  type: types.ADD_FIELD_CLICKED,
  payload: tableIndex,
})

export const updateField = (fieldIndex) => ({
  type: types.UPDATE_FIELD,
  payload: fieldIndex,
})

export const handleFieldsUpdate = (field) => ({
  type: types.HANDLE_FIELDS_UPDATE,
  payload: field,
})

export const handleFieldsSelect = (field) => ({
  type: types.HANDLE_FIELDS_SELECT,
  payload: field,
})