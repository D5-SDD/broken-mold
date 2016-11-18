'use strict';

import fs from 'fs';

// Import libraries
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import TreeMenu, {Utils} from 'react-tree-menu';
import {readMap,exportMap} from '../../lib/Character';
import {
  startUDPBroadcast, stopUDPBroadcast, startUDPListen,
  stopUDPListen, startTCPServer, closeTCPServer
} from '../../lib/Networking';

// Import the stylesheet
import '../stylesheets/components/CharacterMenu';


const CHAR_LOCATION = './test/Characters/';

// Displays a menu of all characters that are available for a client to view
class CharacterMenu extends React.Component {
  constructor(props) {
    super(props);

    // update the map
    // TODO: call update function
    exportMap();
    // read Map
    this.characterMap = readMap();

    // parse the character map and create a tree data structure for the menu
    var data = [];
    for (let i = 0; i < this.characterMap.length; i++) {
      data.push(this.characterMap[i]);
      data[i].checkbox = false;
    }

    this.state = {
      treeData: data,
      sharing: false,
      lookingForClient: false,
      receiving: false
    };

    this._toggleSharing = this._toggleSharing.bind(this);
    this._confirmSharing = this._confirmSharing.bind(this);
    this._toggleReceiving = this._toggleReceiving.bind(this);
    this._toggleLookingForClient = this._toggleLookingForClient.bind(this);
  }

  // Called when the "Share" button is clicked, toggles the sharing state
  _toggleSharing() {
    var sharing = !this.state.sharing;
    var data = this.state.treeData;
    var lookingForClient = this.state.lookingForClient;
    var receiving = this.state.receiving;
    for (let i = 0; i < data.length; i++) {
      data[i].checkbox = sharing;
      data[i].checked = false;
    }
    this.setState({
      treeData: data,
      sharing: sharing,
      lookingForClient: lookingForClient,
      receiving: receiving
    });
  }

  // Called when the "OK" button is clicked while sharing,
  // initiates a confirmation dialog followed by the sharing interface
  _confirmSharing() {
    if (!this.state.sharing) {
      return;
    }

    // parse the character tree and find selected characters
    var charactersToShare = [];
    for (let i = 0; i < this.state.treeData.length; i++) {
      if (this.state.treeData[i].checked === true) {
        charactersToShare.push(this.state.treeData[i]);
      }
    }

    this._toggleSharing();

    // only attempt to share if there were selected characters
    if (charactersToShare.length === 0) {
      return;
    }

    this._toggleLookingForClient();

    startTCPServer((charactersToShare, client) => {
      //once connection is made, save and
      stopUDPBroadcast();
      for (let i = 0; i < charactersToShare.length; i++) {
        var temp = JSON.parse(fs.readFileSync(CHAR_LOCATION + charactersToShare[i].filename));
        console.log(temp);
        client.sendMessage(temp);
      }
      //close TCP client
      closeTCPServer();
      this._toggleLookingForClient();
    }, charactersToShare, () => {}, false);
    startUDPBroadcast(false);
  }

  // Called when a character is selected from the menu
  _handleNodeClicked(action, node) {
    stopUDPBroadcast();
    stopUDPListen();
    closeTCPServer();
    this.props.selectCharacterCB(this.state.treeData[node]);
  }

  // Called when a checkbox is clicked during sharing
  _handleNodeCheckChange(propName, lineage) {
    this.setState(
      Utils.getNewTreeState(lineage, this.state.treeData, propName)
    );
    this._confirmSharing();
  }

  _toggleReceiving() {
    var sharing = this.state.sharing;
    var data = this.state.treeData;
    var lookingForClient = this.state.lookingForClient;
    var receiving = !this.state.receiving;

    if (receiving) {
      startUDPListen(false, () => {
        exportMap();
        this.characterMap = readMap();
        var data = [];
        for (let i = 0; i < this.characterMap.length; i++) {
          data.push(this.characterMap[i]);
          data[i].checkbox = false;
        }
        this.setState({
          treeData: data,
          sharing: false,
          lookingForClient: false,
          receiving: false
        });
      });
    } else {
      stopUDPListen();
    }

    this.setState({
      treeData: data,
      sharing: sharing,
      lookingForClient: lookingForClient,
      receiving: receiving
    });
  }

  _toggleLookingForClient() {
    var sharing = this.state.sharing;
    var data = this.state.treeData;
    var lookingForClient = !this.state.lookingForClient;
    var receiving = this.state.receiving;

    if (this.state.lookingForClient) {
      stopUDPBroadcast();
      closeTCPServer();
    }
    if (this.state.sharing) {
      sharing = false;
    }

    this.setState({
      treeData: data,
      sharing: sharing,
      lookingForClient: lookingForClient,
      receiving: receiving
    });
  }

  render() {
    var shareButtonText = ' Share ';
    var shareButtonStyle = 'primary';
    var cancelButton = null;
    var disableButtons = false;

    // customize the share button
    if (this.state.sharing === true) {
      shareButtonText = 'Cancel';
      shareButtonStyle = 'danger';
    }

    if (this.state.lookingForClient === true || this.state.receiving === true) {
      cancelButton = (
      <Button
          bsStyle="danger"
          bsSize="small"
          onClick={() => {
            if (this.state.lookingForClient) {
              this._toggleLookingForClient();
            } else {
              this._toggleReceiving();
            }
          }}
        >
          Cancel
        </Button>
      );
      disableButtons = true;
      // TODO: Making it so other buttons can't be pressed
    }

    return (
      <div className="character-menu">
        <input
          style={{display: 'none'}}
          id="fileDialog"
          type="file"
          title="Load Character"
          accept=".json"
          onChange={this.props.loadCharacterCB}
        />
        <nav className="navigation" id="header">
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={this.props.newCharacterCB}
            disabled = {disableButtons}
          >
            New
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={() => {
              $('#fileDialog').click();
            }}
            disabled = {disableButtons}
          >
            Load
          </Button>
          <Button
            bsStyle={shareButtonStyle}
            bsSize="small"
            onClick={this._toggleSharing}
            disabled = {disableButtons}
          >
            {shareButtonText}
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={this._toggleReceiving}
            disabled = {disableButtons}
          >
            Receive Character
          </Button>
        </nav>
        <TreeMenu
          classNamePrefix={'character-tree'}
          collapsible={false}
          onTreeNodeClick={this._handleNodeClicked.bind(this, 'clicked')}
          onTreeNodeCheckChange={
            this._handleNodeCheckChange.bind(this, 'checked')
          }
          data={this.state.treeData}
        />
        <nav className="navigation" id="footer">
          {cancelButton}
        </nav>
      </div>
    );
  }
}

CharacterMenu.propTypes = {
  loadCharacterCB: React.PropTypes.func.isRequired,
  newCharacterCB: React.PropTypes.func.isRequired,
  selectCharacterCB: React.PropTypes.func.isRequired
};

export default CharacterMenu;
