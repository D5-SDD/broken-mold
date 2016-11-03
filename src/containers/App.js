'use strict';

// Import external libraries
import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';

// Import containers
import CharacterView from './CharacterView';
import DMView from './DMView';

// Import internal libraries
import {readMap} from '../../lib/Character';

// Import stylesheet
import '../stylesheets/containers/App.scss';

// Main container for the React application, handles the various tabs and views
class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    // import the characters from the character map file
    this.characters = readMap();
  }

  // Called when a new tab is selected
  _handleSelect(selectedKey) {
    this.setState({activeTab: selectedKey});
  }

  render() {
    return (
      <Tabs defaultActiveKey={1} animation={false} id="app-tabs">
        <Tab eventKey={1} title="Characters">
          <CharacterView />
        </Tab>
        <Tab eventKey={2} title="Dungeon Master" disabled>
          <DMView />
        </Tab>
        <Tab eventKey={3} title="Networking" disabled>
          <h2>Why are you here? This tab isn't working yet</h2>
        </Tab>
      </Tabs>
    );
  }
}

export default AppContainer;
