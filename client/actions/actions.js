import * as types from './action-types.js'

export const chooseDatabase = (dbName) => ({
  type: types.CHOOSE_DATABASE,
  payload: dbName,
});

export const chooseApp = (app) => ({
  type: types.CHOOSE_APP,
  payload: app
})

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

export const createTable = (tableIndex) => ({
  type: types.CREATE_TABLE,
  payload: tableIndex,
})

export const saveFile = (table) => ({
  type: types.FILE,
  payload: table,
})

export const exportFile = (table) => ({
  type: types.FILE,
  payload: table
})