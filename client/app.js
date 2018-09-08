import React from 'react';
import ReactDOM from 'react-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

//Components
import Index from './components';

const ThemedIndex = () => (
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <Index />
    </MuiThemeProvider>
  );

ReactDOM.render( 
    <ThemedIndex />, 
    document.querySelector('#app')
);
