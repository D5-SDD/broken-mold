'use strict';

import fs from 'fs';

// Import libraries
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import TreeMenu, {Utils} from 'react-tree-menu';
import {UDP, TCP, startUDPBroadcast, 
  stopUDPBroadcast, startUDPListen, startTCPServer, closeTCPServer} from '../../lib/Networking';

// Import the stylesheet
import '../stylesheets/components/CharacterMenu';


const CHAR_LOCATION = './test/Characters/'

// Displays a menu of all characters that are available for a client to view
class CharacterMenu extends React.Component {
  constructor(props) {
    super(props);

    // parse the character map and create a tree data structure for the menu
    var data = [];
    for (let i = 0; i < this.props.characterMap.length; i++) {
      data.push(this.props.characterMap[i]);
      data[i].checkbox = false;
    }

    this.state = {
      treeData: data,
      sharing: false
    };

    this._toggleSharing = this._toggleSharing.bind(this);
    this._confirmSharing = this._confirmSharing.bind(this);
  }

  // Called when the "Share" button is clicked, toggles the sharing state
  _toggleSharing() {
    var sharing = !this.state.sharing;
    var data = this.state.treeData;
    for (let i = 0; i < data.length; i++) {
      data[i].checkbox = sharing;
      data[i].checked = false;
    }
    this.setState({
      treeData: data,
      sharing: sharing
    });
  }

  // Called when the "OK" button is clicked while sharing,
  // initiates a confirmation fialog followed by the sharing interface
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
    
    startTCPServer((charactersToShare, client) => {
      //once connection is made, save and 
      stopUDPBroadcast();      
      for(let i = 0; i < charactersToShare.length; i++)
      {
        var temp = fs.readFileSync(CHAR_LOCATION + charactersToShare[i].filename);
        client.write(temp);        
      }
      //close TCP client
      closeTCPServer();
    }, charactersToShare);
    startUDPBroadcast(false);
  }

  // Called when a character is selected from the menu
  _handleNodeClicked(action, node) {
    this.props.selectCharacterCB(this.state.treeData[node]);
  }

  // Called when a checkbox is clicked during sharing
  _handleNodeCheckChange(propName, lineage) {
    this.setState(
      Utils.getNewTreeState(lineage, this.state.treeData, propName)
    );
  }

  render() {
    var shareButtonText = ' Share ';
    var shareButtonStyle = 'primary';
    var continueButton = null;

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

    return (
      <div className="character-menu">
        <input
          style={{display: 'none'}}
          id="fileDialog"
          type="file"
          accept=".json"
          multiple
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
            onClick={this.props.loadCharacterCB}
          >
            Load
          </Button>
          <Button
            bsStyle={shareButtonStyle}
            bsSize="small"
            onClick={this._toggleSharing}
          >
            {shareButtonText}
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
          {continueButton}
        </nav>
      </div>
    );
  }
}

CharacterMenu.propTypes = {
  characterMap: React.PropTypes.array.isRequired,
  loadCharacterCB: React.PropTypes.func.isRequired,
  newCharacterCB: React.PropTypes.func.isRequired,
  selectCharacterCB: React.PropTypes.func.isRequired
};

export default CharacterMenu;
