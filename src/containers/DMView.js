'use strict';

// Import libraries
import React from 'react';
import {Button, Tab, Tabs} from 'react-bootstrap';
import fs from 'fs';

// Import containers
import CharacterSheet from './CharacterSheet';

// Import internal libraries
import Character, {CHARACTER_DIR} from '../../lib/Character';
import {
  UDP, TCP, startUDPBroadcast, stopUDPBroadcast,
  startTCPServer, closeTCPServer, DM_FOLDER
} from '../../lib/Networking';


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
    var index = this.clients.indexOf(client);
    var newCharacter = new Character(DM_FOLDER + charLocation);
    if (index !== -1) {
      let needToDelete = false;
      let originalName = this.characters[index].originalName;
      if (newCharacter.name !== this.characters[index].originalName) {
        needToDelete = true;
      }
      this.characters.splice(index, 1);
      this.clients.splice(index, 1);  
      if (needToDelete && fs.existsSync(DM_FOLDER + originalName + '.json')) {
        fs.unlink(DM_FOLDER + originalName + '.json');
      }
    }
    this.characters.push(newCharacter);
    //console.log('saved correctly');
    this.clients.push(client);
    this.forceUpdate();
  }

  characterRemovedCB(client) {
    var index = this.clients.indexOf(client);
    if (fs.existsSync(DM_FOLDER + this.characters[index].originalName + '.json')) {
      fs.unlink(DM_FOLDER + this.characters[index].originalName + '.json');
    }
    this.characters.splice(index, 1);
    this.clients.splice(index, 1);
    this.forceUpdate();
  }

  openConnectionCB() {
    startUDPBroadcast(true);
    startTCPServer((charLocation, client) => {
      this.characterReceivedCB(charLocation, client);
    }, null, (client) => {
      this.characterRemovedCB(client);
    }, true);

    this.props.networkingStateCB(true, true);
  }

  closeAllDMConnections() {
    closeTCPServer();
    stopUDPBroadcast();
    this.props.networkingStateCB(false, false);
  }

  closeUDPBroadcasting() {
    stopUDPBroadcast();
    let TCPOpen = this.props.TCPOpen;
    this.props.networkingStateCB(TCPOpen, false);
  }

  render() {
    var tabContainer = null;
    if (this.characters.length > 0) {
      var tabs = [];
      for (let i = 0; i < this.characters.length; i++) {
        tabs.push(
          <Tab key={i} eventKey={i} title={this.characters[i].name}>
            <CharacterSheet character={this.characters[i]} client={this.clients[i]} />
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
            disabled={Boolean(this.props.UDPOpen || UDP || (TCP && TCP.client))}
          >
            Start Accepting Connections
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={this.closeUDPBroadcasting.bind(this)}
            disabled = {!this.props.UDPOpen}
          >
            Stop Accepting Connections
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={this.closeAllDMConnections.bind(this)}
            disabled = {!this.props.TCPOpen}
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
  TCPOpen: React.PropTypes.bool.isRequired,
  UDPOpen: React.PropTypes.bool.isRequired,
  networkingStateCB: React.PropTypes.func.isRequired
};

export default DMView;
