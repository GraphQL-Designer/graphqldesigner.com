import { combineReducers } from 'redux';

// import all reducers here
import schemaReducers from './schemaReducers.js';
import generalReducers from './generalReducers.js';
// import queryReducers from './queryReducers.js';


// combine reducers
const combinedReducers = combineReducers({
  general: generalReducers,
  schema: schemaReducers,
  // query: queryReducers,
});

// make the combined reducers available for import
export default combinedReducers;
