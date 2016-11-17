'use strict';

import fs from 'fs';

// Import libraries
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import TreeMenu, {Utils} from 'react-tree-menu';
import {readMap,exportMap} from '../../lib/Character';
import {UDP, TCP, startUDPBroadcast, 
  stopUDPBroadcast, startUDPListen, stopUDPListen, 
  startTCPServer, closeTCPServer} from '../../lib/Networking';

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
      recieving: false
    };

    this._toggleSharing = this._toggleSharing.bind(this);
    this._confirmSharing = this._confirmSharing.bind(this);
    this._toggleRecieving = this._toggleRecieving.bind(this);
    this._toggleLookingForClient = this._toggleLookingForClient.bind(this);
  }

  // Called when the "Share" button is clicked, toggles the sharing state
  _toggleSharing() {
    var sharing = !this.state.sharing;
    var data = this.state.treeData;
    var lookingForClient = this.state.lookingForClient;
    var recieving = this.state.recieving;
    for (let i = 0; i < data.length; i++) {
      data[i].checkbox = sharing;
      data[i].checked = false;
    }
    this.setState({
      treeData: data,
      sharing: sharing,
      lookingForClient: lookingForClient,
      recieving: recieving    
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
    // TODO: Make the appropriate calls to the networking library

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
    }, charactersToShare);
    startUDPBroadcast(false);
  }

  // Called when a character is selected from the menu
  _handleNodeClicked(action, node) {
    stopUDPBroadcast();
    closeTCPServer();
    this.props.selectCharacterCB(this.state.treeData[node]);
  }

  // Called when a checkbox is clicked during sharing
  _handleNodeCheckChange(propName, lineage) {
    this.setState(
      Utils.getNewTreeState(lineage, this.state.treeData, propName)
    );
  }
  
  _toggleRecieving() {
    var sharing = this.state.sharing;
    var data = this.state.treeData;
    var lookingForClient = this.state.lookingForClient;
    var recieving = !this.state.recieving
    
    if (recieving) {
      startUDPListen(() => {
        exportMap();
        this.characterMap = readMap();
        var data = [];
        for (let i = 0; i < this.characterMap.length; i++) {
          data.push(this.characterMap[i]);
          data[i].checkbox = false;
        }
        this.state.treeData = data;
        this._toggleRecieving();
      });
    } else {
      stopUDPListen();
    }
    
    this.setState({
      treeData: data,
      sharing: sharing,
      lookingForClient: lookingForClient,
      recieving: recieving    
    });    
  }
  
  _toggleLookingForClient() {
    var sharing = this.state.sharing;
    var data = this.state.treeData;
    var lookingForClient = !this.state.lookingForClient;
    var recieving = this.state.recieving
      
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
      recieving: recieving    
    }); 
  }

  render() {
    var shareButtonText = ' Share ';
    var shareButtonStyle = 'primary';
    var continueButton = null;
    var cancelButton = null;
    var disableButtons = false;

    // customize the share button
    if (this.state.sharing === true) {
      shareButtonText = 'Cancel';
      shareButtonStyle = 'danger';
      continueButton = (
        <Button
          className="continue"
          bsStyle="success"
          bsSize="small"
          onClick={this._confirmSharing}
        >
          OK
        </Button>
      );
    }
    
    if (this.state.lookingForClient === true || this.state.recieving === true) {
      cancelButton = (
      <Button
          bsStyle="danger"
          bsSize="small"
          onClick={() => {          
            if (this.state.lookingForClient) {
              this._toggleLookingForClient()
            } else {
              this._toggleRecieving();
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
            disabled
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
            onClick={this._toggleRecieving}
            disabled = {disableButtons}
          >
            Recieve Character
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
          {continueButton},{cancelButton}
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
