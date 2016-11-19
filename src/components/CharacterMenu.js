'use strict';

import fs from 'fs';

// Import libraries
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import TreeMenu, {Utils} from 'react-tree-menu';
import {readMap,exportMap, deleteCharacter} from '../../lib/Character';
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
      receiving: false,
      deleting: false
    };

    this._toggleSharing = this._toggleSharing.bind(this);
    this._confirmSharing = this._confirmSharing.bind(this);
    this._toggleReceiving = this._toggleReceiving.bind(this);
    this._toggleLookingForClient = this._toggleLookingForClient.bind(this);
    this._toggleDelete = this._toggleDelete.bind(this);
    this._resetMenu = this._resetMenu.bind(this);
  }

  _resetMenu() {
    exportMap();
    this.characterMap = readMap();
    var data = [];
    for (let i = 0; i < this.characterMap.length; i++) {
      data.push(this.characterMap[i]);
    }
    this.setState({
      treeData: data,
      sharing: false,
      lookingForClient: false,
      receiving: false,
      deleting: false
    });
  }

  // Called when the "Share" button is clicked, toggles the sharing state
  _toggleSharing() {
    var sharing = !this.state.sharing;
    var data = this.state.treeData;
    var lookingForClient = this.state.lookingForClient;
    var receiving = this.state.receiving;
    var deleting = this.state.deleting;
    this.setState({
      treeData: data,
      sharing: sharing,
      lookingForClient: lookingForClient,
      receiving: receiving,
      deleting: deleting
    });
  }

  // Called when the "OK" button is clicked while sharing,
  // initiates a confirmation dialog followed by the sharing interface
  _confirmSharing(character) {
    if (!this.state.sharing) {
      return;
    }

    this._toggleSharing();

    this._toggleLookingForClient();

    startTCPServer((character, client) => {
      //once connection is made, save and
      stopUDPBroadcast();
      var temp = JSON.parse(fs.readFileSync(CHAR_LOCATION + character[i].filename));
      console.log(temp);
      client.sendMessage(temp);
      //close TCP client
      closeTCPServer();
      this._toggleLookingForClient();
    }, character, () => {}, false);
    startUDPBroadcast(false);
  }

  // Called when a character is selected from the menu
  _handleNodeClicked(action, node) {
    if (this.state.sharing) {
      this._confirmSharing(this.state.treeData[node]);
    } else if (this.state.deleting) {
      deleteCharacter(this.state.treeData[node].filename, () => {
        this._resetMenu();
      });
    } else if (this.state.lookingForClient || this.state.receiving) {
      //DO NOTHING
    }else {
      stopUDPBroadcast();
      stopUDPListen();
      closeTCPServer();
      this.props.selectCharacterCB(this.state.treeData[node]);
    }
  }

  _toggleReceiving() {
    var sharing = this.state.sharing;
    var data = this.state.treeData;
    var lookingForClient = this.state.lookingForClient;
    var receiving = !this.state.receiving;
    var deleting = this.state.deleting;

    if (receiving) {
      startUDPListen(false, () => {
        this._resetMenu();
      });
    } else {
      stopUDPListen();
    }

    this.setState({
      treeData: data,
      sharing: sharing,
      lookingForClient: lookingForClient,
      receiving: receiving,
      deleting: deleting
    });
  }

  _toggleLookingForClient() {
    var sharing = this.state.sharing;
    var data = this.state.treeData;
    var lookingForClient = !this.state.lookingForClient;
    var receiving = this.state.receiving;
    var deleting = this.state.deleting;

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
      receiving: receiving,
      deleting: deleting
    });
  }
  
  _toggleDelete() {
    var sharing = this.state.sharing;
    var data = this.state.treeData;
    var lookingForClient = this.state.lookingForClient;
    var receiving = this.state.receiving;
    var deleting = !this.state.deleting; 
    
    this.setState({
      treeData: data,
      sharing: sharing,
      lookingForClient: lookingForClient,
      receiving: receiving,
      deleting: deleting
    });
  }

  render() {
    var shareButtonText = ' Share ';
    var shareButtonStyle = "primary";
    var deleteButtonText = ' Delete ';
    var deleteButtonStyle = "primary";
    var cancelButton = null;
    var disableButtons = false;

    // customize the share button
    if (this.state.sharing === true) {
      shareButtonText = ' Cancel ';
      shareButtonStyle = "danger";
      disableButtons = true;
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
    }
    
    if (this.state.deleting) {
      deleteButtonText = ' Cancel ';
      var deleteButtonStyle = "danger";
      disableButtons = true;
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
            bsStyle={deleteButtonStyle}
            bsSize="small"
            onClick={this._toggleDelete}
            disabled = {Boolean(disableButtons && !this.state.deleting)}
          >
            {deleteButtonText}
          </Button>
          <Button
            bsStyle={shareButtonStyle}
            bsSize="small"
            onClick={this._toggleSharing}
            disabled = {Boolean(disableButtons && !this.state.sharing)}
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
