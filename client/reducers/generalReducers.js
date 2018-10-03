import * as types from '../actions/action-types';

const initialState = {
  statusMessage: '',
};

const generalReducers = (state = initialState, action) => {
  switch (action.type) {
    case types.MESSAGE:
      return {
        ...state,
      };

    case types.HANDLE_SNACKBAR_UPDATE:
      const newState = action.payload;

      return {
        ...state,
        statusMessage: newState,
      };

    default:
      return state;
  }
};

export default generalReducers;
