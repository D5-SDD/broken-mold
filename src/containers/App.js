'use strict';

// Import React and components
import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import CharacterView from './CharacterView';
import DMView from './DMView';

// Import libraries
import Character, {readMap} from '../../lib/Character';

// Import stylesheet
import '../stylesheets/containers/App.scss';

const CHARACTER_MAP_PATH = './test/character_map.json';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.characterMap = readMap(CHARACTER_MAP_PATH);

    this.characters = [];
    for (let i = 0; i < this.characterMap.length; i++) {
      this.characters.push(new Character(this.characterMap[i].filename));
    }
  }

  // Called when a new tab is selected
  _handleSelect(selectedKey) {
    this.setState({activeTab: selectedKey});
  }

  render() {
    return (
      <Tabs defaultActiveKey={1} animation={true} id="app-tabs">
        <Tab eventKey={1} title="Characters">
          <CharacterView characterMap={this.characterMap} />
        </Tab>
        <Tab eventKey={2} title="Dungeon Master">
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
