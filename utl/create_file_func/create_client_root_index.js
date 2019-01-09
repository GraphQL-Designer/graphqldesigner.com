function buildClientRootIndex() {
  const query = `import React from 'react';
import { render } from 'react-dom';

// Components
import Index from './components';

render(
    <Index />, document.getElementById('app'),
); 
`;
  return query;
}

module.exports = buildClientRootIndex;