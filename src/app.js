'use strict';

// Import React libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Import the main stylesheet
import './stylesheets/main.scss';

// Import the AppContainer
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
