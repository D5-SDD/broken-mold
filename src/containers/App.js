'use strict';

// Import React and components
import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
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

    var characterMapPath = './test/character_map.json';
    this.characterMap = JSON.parse(fs.readFileSync(characterMapPath)).map;

    this.characters = [];
    for (let i = 0; i < this.characterMap.length; i++) {
      let path = './test/Characters/' + this.characterMap[i].filename;
      this.characters.push(new Character(path));
    }
  }

  // Called when a new tab is selected
  handleSelect(index, last) {
    //console.log('Selected tab: ' + index + ', Last tab: ' + last);
    return index, last;
  }

  render() {
    return (
      <Tabs
        onSelect={this.handleSelect}
        selectedIndex={0}
      >
        <TabList>
          <Tab>Characters</Tab>
          <Tab>Dungeon Master</Tab>
          <Tab>Networking</Tab>
        </TabList>

        <TabPanel>
          <CharacterView characterMap={this.characterMap} />
        </TabPanel>
        <TabPanel>
          <DMView />
        </TabPanel>
        <TabPanel>
          <h2>Why are you here? This tab isn't working yet.</h2>
        </TabPanel>
      </Tabs>
    );
  }
}

export default AppContainer;
