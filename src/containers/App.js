'use strict';

import React, {Component} from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import CharacterView from './CharacterView';
import DMView from './DMView';

//import Character from '../../lib/Character';

class AppContainer extends Component {
  constructor(props) {
    super(props);

    /*
    this.testChar = new Character('../../test/example_character.json');

    console.log(this.testChar.path);
    console.log('strength: ' + this.testChar.strength.value);
    console.log('modifier: ' + this.testChar.strength.mod);
    console.log(this.testChar.doStuff('testName'));
    */
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
          <CharacterView />
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
