import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//Components
import Index from './components';

const ThemedIndex = () => (
  <MuiThemeProvider>
    <Index />
  </MuiThemeProvider>
);

render(
  <Provider store={store}>
    <ThemedIndex/>
  </Provider>,document.getElementById('app')
);






