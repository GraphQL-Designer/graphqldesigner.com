import { combineReducers } from 'redux';

// import all reducers here
import schemaReducers from './schemaReducers.js';
import queryReducers from './queryReducers.js';

// combine reducers
const reducers = combineReducers({
  data: schemaReducers,

  // queryReducers: queryReducers
});

// make the combined reducers available for import
export default reducers;

