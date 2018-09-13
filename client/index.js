import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//Components
import App from './components/app.js';

const ThemedIndex = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

render(
  <Provider store={store}>
    <ThemedIndex/>
  </Provider>,document.getElementById('app')
);






