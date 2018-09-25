import * as types from '../actions/action-types';

const initialState = {
  database: '',
  statusMessage: ''
};

const generalReducers = (state = initialState, action) => {
  let database = state.database;

  switch (action.type) {
    case types.CHOOSE_DATABASE:
      database = action.payload;

      return {
        ...state,
        database
      };

    case types.MESSAGE:
      return {
        ...state
      };

    case types.HANDLE_SNACKBAR_UPDATE:
      const newState = action.payload;

      return {
        ...state,
        statusMessage: newState
      };

    default:
      return state;
  }
};

export default generalReducers;
