'use strict';

// Import libraries
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

// Import internal libraries
import {UDP, TCP, startUDPBroadcast, stopUDPBroadcast, 
  startUDPListen, startTCPServer, closeTCPServer} from '../../lib/Networking';

import Character from '../../lib/Character';

class NetworkingView extends React.Component {
	constructor(props) {
		super(props);
    this.characters = [];
    
    // TODO: remove character from characters upon disconnect
	}

	render() {
		return (
      <div className="networking-view">
        <nav className="navigation" id="header">
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={() => {
              startUDPBroadcast(true);
              startTCPServer((charLocation) => {
                var test = new Character(charLocation);
                this.characters.push(test);
                console.log(this);
              }, []);
            }}
          >
            Open DM Connections
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={() => {
              stopUDPBroadcast();
            }}
          >
            Close DM Connections
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
            Stop DM Session
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
      </div>
		);
	}
}

NetworkingView.propTypes = {};

export default NetworkingView;
