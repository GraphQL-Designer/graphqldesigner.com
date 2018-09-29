import * as types from '../actions/action-types';

const initialState = {
  projectReset: true,
  tableIndex: 0,
  tables: {},
  selectedQuery: {
    fields: {},
    tableID: -1,
  },
  selectedField: {
    name: '',
    type: 'String',
    primaryKey: false,
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

const queryReducers = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default queryReducers;
