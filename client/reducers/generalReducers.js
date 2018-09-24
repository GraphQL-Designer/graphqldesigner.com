import * as types from '../actions/action-types';

const initialState = {
  database: '',
  message: {
    open: false,
    message: ''
  }
};

const generalReducers = (state = initialState, action) => {
  let database = state.database;

  switch(action.type) {
    case types.CHOOSE_DATABASE:
      database = action.payload; 

      return {
        ...state,
        database, 
      }

    case types.MESSAGE:
      
    return {
      ...state,

    }

    case types.HANDLE_SNACKBAR_UPDATE:
    const newState = Object.assign({}, {open: action.payload.open, message: action.payload.message})

      return {
        ...state,
        message : newState
      }


    default:
      return state;
  }
};

export default generalReducers;