'use strict';

import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import TreeMenu, {Utils} from 'react-tree-menu';

import '../stylesheets/components/CharacterMenu';

class CharacterMenu extends React.Component {
  constructor(props) {
    super(props);

    var data = [];
    for (let i = 0; i < this.props.characterMap.length; i++) {
      data.push({
        label: this.props.characterMap[i].label,
        checkbox: false
      });
    }

    this.state = {
      treeData: data,
      sharing: false
    };

    this._toggleSharing = this._toggleSharing.bind(this);
    this._confirmSharing = this._confirmSharing.bind(this);
  }

  // Fires when the "Share" button is clicked, toggles the sharing state
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

  _confirmSharing() {
    if (!this.state.sharing) {
      return;
    }

    // Parse the character tree and find selected characters
    var charactersToShare = [];
    for (let i = 0; i < this.state.treeData.length; i++) {
      if (this.state.treeData[i].checked === true) {
        charactersToShare.push(this.state.treeData[i]);
      }
    }

    this._toggleSharing();

    // Only want to share if there were selected characters
    if (charactersToShare.length === 0) {
      return;
    }

    console.log(charactersToShare);

    // TODO: Make the appropriate calls to the networking library and shit here
  }

  _handleNodeClicked(action, node) {
    this.props.selectCharacterCB(this.state.treeData[node]);
  }

  _handleNodeCheckChange(propName, lineage) {
    this.setState(
      Utils.getNewTreeState(lineage, this.state.treeData, propName)
    );
  }

  render() {
    var shareButtonText = ' Share ';
    var shareButtonStyle = 'primary';
    var continueButton = null;
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
          <Button bsStyle="primary" bsSize="small">
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
  selectCharacterCB: React.PropTypes.func.isRequired,
  loadCharacterCB: React.PropTypes.func.isRequired
};

export default CharacterMenu;
