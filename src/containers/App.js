'use strict';

// Import React and components
import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import CharacterView from './CharacterView';
import DMView from './DMView';

// Import libraries
import fs from 'fs';
import Character from '../../lib/Character';

// Import stylesheet
import '../stylesheets/containers/App.scss';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 1
    };

    var characterMapPath = './test/character_map.json';
    this.characterMap = JSON.parse(fs.readFileSync(characterMapPath)).map;

    this.characters = [];
    for (let i = 0; i < this.characterMap.length; i++) {
      let path = './test/Characters/' + this.characterMap[i].filename;
      this.characters.push(new Character(path));
    }

    this._handleSelect = this._handleSelect.bind(this);
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
