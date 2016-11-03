'use strict';

// Import libraries
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

// Import the main stylesheet
import './stylesheets/main.scss';

// Import the React AppContainer
import AppContainer from './containers/App';

// Entry point for the application, renders the React application
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
