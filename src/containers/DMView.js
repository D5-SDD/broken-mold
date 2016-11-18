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
  startUDPBroadcast, stopUDPBroadcast, startUDPListen,
  startTCPServer, closeTCPServer, closeTCPClient
} from '../../lib/Networking';

// The Dungeon Master View for the client
class DMView extends React.Component {
  constructor(props) {
    super(props);

    this.characters = [];
    this.clients = [];

    this.characterReceivedCB = this.characterReceivedCB.bind(this);
    this.characterRemovedCB = this.characterRemovedCB.bind(this);
    // TODO: remove character from characters upon disconnect
  }

  characterReceivedCB(charLocation, client) {
    this.characters.push(new Character(charLocation));
    this.clients.push(client);
    console.log(this.characters);
    console.log(this.clients);
    this.forceUpdate();
  }

  characterRemovedCB(client) {
    var index = this.clients.indexOf(client);
    if (fs.existsSync(CHARACTER_DIR + this.characters[index].originalName + '-DMTemp.json')) {
      fs.unlink(CHARACTER_DIR + this.characters[index].originalName + '-DMTemp.json')
    }
    this.character.splice(index, 1);
    this.clients.splice(index, 1);
    console.log(characters);
    console.log(clients);
  }
  
  openConnectionCB() {
    startUDPBroadcast(true);
    startTCPServer((charLocation, client) => {
      this.characterReceivedCB(charLocation, client);
    }, [], (client) => {
      this.characterRemovedCB(client);
    }, true);
  }
  
  closeAllDMConnections() {
    closeTCPServer();
    stopUDPBroadcast();
    this.characters = [];
    this.clients = [];
    this.forceUpdate();
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
          >
            Open Connections
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={() => {
              stopUDPBroadcast();
            }}
          >
            Close Connections
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={closeAllDMConnections}
          >
            Stop Session
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={() => {
              startUDPListen();
            }}
          >
            Connect to DM
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={closeTCPClient}
          >
            Disconnect from DM
          </Button>
        </nav>
        {tabContainer}
      </div>
    );
  }
}

DMView.propTypes = {};

export default DMView;
