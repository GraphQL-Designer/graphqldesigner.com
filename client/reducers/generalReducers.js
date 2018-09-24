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
  let message = state.message;

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

    default:
      return state;
  }
};

export default generalReducers;