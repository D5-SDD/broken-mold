'use strict';

// Import React libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Import the Container component
import AppContainer from './containers/App';

class App extends React.Component {
  render () {
    return (
      <AppContainer />
    );
  }
}

// Render to index.html
ReactDOM.render(
  <App />,
  document.getElementById('app')
);
