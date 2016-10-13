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
      lastAction: null,
      treeData: data,
      sharing: false
    };

    this._toggleSharing = this._toggleSharing.bind(this);
  }

  // Fires when the "Share" button is clicked, toggles the sharing state
  _toggleSharing() {
    var sharing = !this.state.sharing;
    var data = this.state.treeData;
    for (let i = 0; i < data.length; i++) {
      data[i].checkbox = sharing;
    }
    this.setState({
      treeData: data,
      sharing: sharing
    });
  }

  _setLastActionState(action, node) {
    var toggleEvents = ['checked', 'selected'];

    if (toggleEvents.indexOf(action) >= 0) {
      action += 'Changed';
    }

    var key = 'lastAction';
    var mutation = {};
    mutation[key] = {
      event: action,
      node: node.join(' > '),
    };

    this.setState(mutation);
  }

  _handleDynamicTreeNodePropChange(propName, lineage) {
    this._setLastActionState(propName, lineage);
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
          onClick={this._toggleSharing}
        >
          OK
        </Button>
      );
    }

    return (
      <div className="character-menu">
        <nav className="navigation" id="header">
          <Button bsStyle="primary" bsSize="small">
            New
          </Button>
          <Button bsStyle="primary" bsSize="small">
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
          onTreeNodeClick={this._setLastActionState.bind(this, 'clicked')}
          onTreeNodeCheckChange={
            this._handleDynamicTreeNodePropChange.bind(this, 'checked')
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
  characterMap: React.PropTypes.array.isRequired
};

export default CharacterMenu;
