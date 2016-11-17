'use strict';

// Import libraries
import React from 'react';
import {Button, Tab, Tabs} from 'react-bootstrap';

// Import containers
import CharacterSheet from './CharacterSheet';

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

    this.characterReceivedCB = this.characterReceivedCB.bind(this);
    // TODO: remove character from characters upon disconnect
  }

  characterReceivedCB(charLocation) {
    this.characters.push(new Character(charLocation));
    this.forceUpdate();
  }

  openConnectionCB() {
    startUDPBroadcast(true);
    startTCPServer((charLocation) => {
      this.characterReceivedCB(charLocation);
    }, []);
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
        {tabContainer}
      </div>
    );
  }
}

DMView.propTypes = {};

export default DMView;
