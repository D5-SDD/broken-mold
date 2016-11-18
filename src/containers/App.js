'use strict';

// Import external libraries
import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';

// Import containers
import CharacterView from './CharacterView';
import DMView from './DMView';
import NetworkingView from './NetworkingView';

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
    }
  }

  // Called when a new tab is selected
  _handleSelect(selectedKey) {
    this.setState({activeTab: selectedKey});
  }

  render() {
    return (
      <Tabs
        defaultActiveKey={1}
        animation={false}
        id="app-tabs"
        onSelect={(eventKey) => {
          if (eventKey === 1) {
            stopUDPBroadcast();
            closeTCPServer();
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
          <DMView TCPOpen={this.state.TCPOpen} UDPOpen={this.state.UDPOpen} />
        </Tab>
      </Tabs>
    );
  }
}

AppContainer.propTypes = {};

export default AppContainer;
