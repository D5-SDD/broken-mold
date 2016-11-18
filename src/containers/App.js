'use strict';

// Import external libraries
import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';

// Import containers
import CharacterView from './CharacterView';
import DMView from './DMView';

// Import internal libraries
import {readMap} from '../../lib/Character';
import {stopUDPBroadcast, closeTCPServer} from '../../lib/Networking';

// Import stylesheet
import '../stylesheets/containers/App.scss';

// Main container for the React application, handles the various tabs and views
class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    // import the characters from the character map file
    this.characters = readMap();

    this.state = {
      TCPOpen: false,
      UDPOpen: false
    };

    this.networkingStateCB = this.networkingStateCB.bind(this);
  }

  // Called when a new tab is selected
  _handleSelect(selectedKey) {
    this.setState({activeTab: selectedKey});
  }

  networkingStateCB(TCPOpen, UDPOpen) {
    this.setState({
      TCPOpen: TCPOpen,
      UDPOpen: UDPOpen
    });
  }

  render() {
    return (
      <Tabs
        defaultActiveKey={1}
        animation={false}
        id="app-tabs"
        onSelect={(eventKey) => {
          if (eventKey === 1) {
            // TODO: Make this only happen if UDP broadcast and TCP Server
            stopUDPBroadcast();
            closeTCPServer();
            this.networkingStateCB(false, false);
          }
          if (eventKey === 2) {
            // TODO: find some way to set default state
          }
        }}
      >
        <Tab eventKey={1} title="Characters">
          <CharacterView />
        </Tab>
        <Tab eventKey={2} title="Dungeon Master">
          <DMView
            TCPOpen={this.state.TCPOpen}
            UDPOpen={this.state.UDPOpen}
            networkingStateCB={this.networkingStateCB}
          />
        </Tab>
      </Tabs>
    );
  }
}

AppContainer.propTypes = {};

export default AppContainer;
