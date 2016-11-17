'use strict';

// Import libraries
import React from 'react';
import {Tab, Tabs} from 'react-bootstrap';

// Import containers
import CharacterSheet from './CharacterSheet';

// The Dungeon Master View for the client
class DMTabs extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.characters.length);
  }

  render() {
    var tabs = null;
    for (let i = 0; i < this.props.characters.length; i++) {
      tabs.push(
        <Tab eventKey={i} title={this.props.characters[i].name}>
          <CharacterSheet character={this.props.characters[i]} />
        </Tab>
      );
    }

    return (
      <Tabs animation={false} id="dm-tabs" className="dm-tabs">
        {tabs}
      </Tabs>
    );
  }
}

DMTabs.propTypes = {
  characters: React.PropTypes.array.isRequired
};

export default DMTabs;
