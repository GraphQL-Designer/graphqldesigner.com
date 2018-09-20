import * as types from './action-types.js'

// -------------------------- Welcome and Intro ----------------------------//

export const chooseDatabase = (dbName) => ({
  type: types.CHOOSE_DATABASE,
  payload: dbName,
});

// export const chooseApp = (app) => ({
//   type: types.CHOOSE_APP,
//   payload: app
// })

// ------------------------------- Nav Bar ---------------------------------//

export const openTableCreator = (tableState) => ({
  type: types.OPEN_TABLE_CREATOR,
  payload: tableState,
});

// ----------------------------- Schema App --------------------------------//

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

<<<<<<< HEAD
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
=======
// ----------------------------- Query App -------------------------------//

export const createQuery = (query) => ({
  type: types.CREATE_QUERY,
  payload: query
})

>>>>>>> 2ea10f8de656e0db6423ee346a12ce84240ae3c7
