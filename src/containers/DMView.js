'use strict';

// Import libraries
import React from 'react';
import {Button, Tab, Tabs} from 'react-bootstrap';
import fs from 'fs'

// Import containers
import CharacterSheet from './CharacterSheet';

// Import internal libraries
import Character from '../../lib/Character';
import {
  UDP, TCP, startUDPBroadcast, stopUDPBroadcast, startUDPListen,
  startTCPServer, closeTCPServer, closeTCPClient
} from '../../lib/Networking';

const CHARACTER_DIR = './test/Characters/'
const DM_FOLDER = CHARACTER_DIR + 'DMTemp/';

// The Dungeon Master View for the client
class DMView extends React.Component {
  constructor(props) {
    super(props);

    this.characters = [];
    this.clients = [];

    this.characterReceivedCB = this.characterReceivedCB.bind(this);
    this.characterRemovedCB = this.characterRemovedCB.bind(this);
  }

  characterReceivedCB(charLocation, client) {
    this.characters.push(new Character(charLocation));
    this.clients.push(client);
    this.forceUpdate();
  }

  characterRemovedCB(client) {
    var index = this.clients.indexOf(client);
    if (fs.existsSync(DM_FOLDER + this.characters[index].originalName + '.json')) {
      fs.unlink(DM_FOLDER + this.characters[index].originalName + '.json')
    }
    this.characters.splice(index, 1);
    this.clients.splice(index, 1);
    this.forceUpdate();
  }
  
  openConnectionCB() {
    startUDPBroadcast(true);
    startTCPServer((charLocation, client) => {
      this.characterReceivedCB(charLocation, client);
    }, [], (client) => {
      this.characterRemovedCB(client);
    }, true);
    
    this.setState({
      TCPOpen: true,
      UDPOpen: true
    });
  }
  
  closeAllDMConnections() {
    closeTCPServer();
    stopUDPBroadcast();
    this.setState ({
      TCPOpen: false,
      UDPOpen: false
    });    
  }
  
  closeUDPBroadcasting() {  
    stopUDPBroadcast();
    this.setState ({
      TCPOpen: this.state.TCPOpen,
      UDPOpen: false
    });    
  }
  
  render() {
    var tabContainer = null;
    if (this.characters.length > 0) {
      var tabs = [];
      for (let i = 0; i < this.characters.length; i++) {
        tabs.push(
          <Tab key={i} eventKey={i} title={this.characters[i].name}>
            <CharacterSheet character={this.characters[i]} />
          </Tab>
        );
      }

      tabContainer = (
        <Tabs animation={false} id="dm-tabs" className="dm-tabs">
          {tabs}
        </Tabs>
      );
    }

    return (
      <div className="dm-view">
        <nav className="navigation" id="header">
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={this.openConnectionCB.bind(this)}
            disabled = {Boolean(this.state.UDPOpen || UDP || TCP)}
          >
            Start Accepting Connections
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={this.closeUDPBroadcasting.bind(this)}
            disabled = {!this.state.UDPOpen}
          >
            Stop Accepting Connections
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={this.closeAllDMConnections.bind(this)}
            disabled = {!this.state.TCPOpen}
          >
            Close DM Session
          </Button>
        </nav>
        {tabContainer}
      </div>
    );
  }
}

DMView.propTypes = {
  TCPOpen: React.PropTypes.boolean.isRequired,
  UDPOpen: React.PropTypes.boolean.isRequired
};

export default DMView;
