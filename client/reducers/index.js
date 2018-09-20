import { combineReducers } from 'redux';

// import all reducers here
import reducers from './reducers';

// combine reducers
const combinedReducers = combineReducers({
  data: reducers
});

// make the combined reducers available for import
export default combinedReducers;

