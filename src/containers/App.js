//
// This component is the skeleton around the actual pages, and should only
// contain code that should be seen on all pages. (e.g. navigation bar)
//

'use strict';

import React from 'react';

import Sidebar from './Sidebar';
import SidebarItem from '../components/SidebarItem';

import Character from '../../lib/Character';
//import Networking from '../../lib/Networking';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.testChar = new Character('../../test/example_character.json');

    console.log(this.testChar.path);
    console.log('strength: ' + this.testChar.strength.value);
    console.log('modifier: ' + this.testChar.strength.mod);
    console.log(this.testChar.doStuff('testName'));
  }

  openSidebar() {
    this.refs.left.show();
  }

  render() {
    return (
      <div>
        <button onClick={this.openSidebar}>Open Sidebar!</button>
        <Sidebar ref="left" alignment="left">
          <SidebarItem has="first-page">First Page</SidebarItem>
          <SidebarItem has="second-page">Second Page</SidebarItem>
          <SidebarItem has="third-page">Third Page</SidebarItem>
        </Sidebar>
      </div>
    );
  }
}

export default AppContainer;
