'use strict';

import React from 'react';
import TreeMenu, {Utils} from 'react-tree-menu';

import '../stylesheets/components/CharacterMenu';

class CharacterMenu extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props.characterMap);

    var data = [];
    for (let i = 0; i < this.props.characterMap.length; i++) {
      data.push({
        label: this.props.characterMap[i].label,
        checkbox: true
      });
    }

    this.state = {
      lastAction: null,
      treeData: data
    };

    this._setLastActionState = this._setLastActionState.bind(this);
  }

  _setLastActionState(action, node) {
    var toggleEvents = ['collapsed', 'checked', 'selected'];

    if (toggleEvents.indexOf(action) >= 0) {
      action += 'Changed';
    }

    var key = 'lastAction';

    var mutation = {};
    mutation[key] = {
      event: action,
      node: node.join(' > '),
      time: new Date().getTime()
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
    return (
      <TreeMenu
        id={'character-menu'}
        classNamePrefix={'character-menu'}
        expandIconClass="fa fa-chevron-right"
        collapseIconClass="fa fa-chevron-down"
        onTreeNodeClick={this._setLastActionState.bind(this, 'clicked')}
        onTreeNodeCollapseChange={
          this._handleDynamicTreeNodePropChange.bind(this, 'collapsed')
        }
        onTreeNodeCheckChange={
          this._handleDynamicTreeNodePropChange.bind(this, 'checked')
        }
        data={this.state.treeData}
      />
    );
  }
}

CharacterMenu.propTypes = {
  characterMap: React.PropTypes.array
};

export default CharacterMenu;
