'use strict';

// Import external libraries
import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';

// Import containers
import CharacterView from './CharacterView';
import DMView from './DMView';

// Import internal libraries
import {readMap} from '../../lib/Character';
import {TCP, UDP, stopUDPBroadcast, closeTCPServer} from '../../lib/Networking';

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

  //switches to the state that can broadcast and accept signals as needed
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
            // only happens if UDP broadcast and TCP Server
            if (UDP && (UDP.timer && UDP.dm)) {
              stopUDPBroadcast();
            }
            if (TCP && (!TCP.client && TCP.dm)){
              closeTCPServer();
            }
            this.networkingStateCB(false, false);
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
