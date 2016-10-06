//
// This component is the skeleton around the actual pages, and should only
// contain code that should be seen on all pages. (e.g. navigation bar)
//

'use strict';

import React, {Component} from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import Character from '../../lib/Character';

class AppContainer extends Component {
  constructor(props) {
    super(props);

    this.testChar = new Character('../../test/example_character.json');

    console.log(this.testChar.path);
    console.log('strength: ' + this.testChar.strength.value);
    console.log('modifier: ' + this.testChar.strength.mod);
    console.log(this.testChar.doStuff('testName'));
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
        selectedIndex={2}
      >
        <TabList>
          <Tab>Foo</Tab>
          <Tab>Bar</Tab>
          <Tab>Baz</Tab>
        </TabList>

        <TabPanel>
          <h2>Hello from Foo</h2>
        </TabPanel>
        <TabPanel>
          <h2>Hello from Bar</h2>
        </TabPanel>
        <TabPanel>
          <h2>Hello from Baz</h2>
        </TabPanel>
      </Tabs>
    );
  }
}

export default AppContainer;
