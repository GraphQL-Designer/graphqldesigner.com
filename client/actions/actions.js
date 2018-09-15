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

export const deleteField = (...tableIndex) => ({
  type: types.DELETE_FIELD,
<<<<<<< HEAD
  payload: tableIndex
});
=======
  payload: fieldName,
});

export const addFieldClicked = (fieldName) => ({
  type: types.ADD_FIELD_CLICKED,
  payload: fieldName,
})
>>>>>>> 5e9e4308b240d52079c4407b2dd27d58c1176c8e
