import * as types from '../actions/action-types';

const initialState = {
  message: {
    open: false,
    message: '',
  },
};

const generalReducers = (state = initialState, action) => {

  switch(action.type) {
    case types.MESSAGE:

      return {
        ...state,

      };

    case types.HANDLE_SNACKBAR_UPDATE:
      const newState = Object.assign({}, {open: action.payload.open, message: action.payload.message});

      return {
        ...state,
        message: newState,
      };


    default:
      return state;
  }
};

export default generalReducers;
