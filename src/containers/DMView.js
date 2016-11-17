'use strict';

// Import libraries
import React from 'react';
import {Button} from 'react-bootstrap';

// Import containers
import DMTabs from './DMTabs';

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

    // TODO: remove character from characters upon disconnect
  }

  openConnectionCB() {
    startUDPBroadcast(true);
    startTCPServer((charLocation, client) => {
      var newChar = new Character(charLocation);
      this.characters.push(newChar);
      this.clients.push(client);
      console.log(this.characters);
      console.log(this.clients);
      //this.forceUpdate();
    }, [], (client) => {
      var index = this.clients.indexOf(client);
      if (fs.existsSync(CHARACTER_DIR + this.characters[index].originalName + '-DMTemp.json')) {
        fs.unlink(CHARACTER_DIR + this.characters[index].originalName + '-DMTemp.json')
      }
      this.character.splice(index, 1);
      this.clients.splice(index, 1);
      console.log(characters);
      console.log(clients);
    });
  }
  

  render() {
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
            onClick={() => {
              closeTCPServer();
              stopUDPBroadcast();
              this.characters = [];
            }}
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
        <DMTabs characters={this.characters} />
      </div>
    );
  }
}

DMView.propTypes = {};

export default DMView;
