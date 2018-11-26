import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

// Material UI
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Components
import App from './components/app.jsx';

const ThemedIndex = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <App />
  </MuiThemeProvider>
);

render(
  <Provider store={store}>
    <ThemedIndex />
  </Provider>, document.getElementById('app'),
);
