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
  startTCPServer, closeTCPServer
} from '../../lib/Networking';

// The Dungeon Master View for the client
class DMView extends React.Component {
  constructor(props) {
    super(props);

    this.characters = [];

    // TODO: remove character from characters upon disconnect
  }

  openConnectionCB() {
    startUDPBroadcast(true);
    startTCPServer((charLocation) => {
      var test = new Character(charLocation);
      this.characters.push(test);
      console.log(this.characters);
      //this.forceUpdate();
    }, []);
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
            UDP Listen
          </Button>
        </nav>
        <DMTabs characters={this.characters} />
      </div>
    );
  }
}

DMView.propTypes = {};

export default DMView;
