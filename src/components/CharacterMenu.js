'use strict';

import React from 'react';
import TreeMenu, {TreeNode, Utils} from 'react-tree-menu';

class CharacterMenu extends React.Component {
  constructor(props) {
    super(props);

    var data = [
      {
        label: 'Option 1'
      },
      {
        label: 'Option 2',
        children : [
          {
            checkbox: true,
            label: 'Sub Option A',
            children: [
              {
                label: 'Third Level Nest Option 1',
                checkbox : true
              },
              {
                label: 'Third Level Nest Option 2',
                checkbox : true
              }
            ]
          },
          {
            checkbox: true,
            label: 'Sub Option B'
          }
        ]
      }
    ];

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

    console.log('Controller View received tree menu ' + action + ' action: ' + node.join(' > '));

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
    this.setState(Utils.getNewTreeState(lineage, this.state.treeData, propName));
  }

  render() {
    return (
      <TreeMenu
        expandIconClass="fa fa-chevron-right"
        collapseIconClass="fa fa-chevron-down"
        onTreeNodeClick={this._setLastActionState.bind(this, 'clicked')}
        onTreeNodeCollapseChange={this._handleDynamicTreeNodePropChange.bind(this, 'collapsed')}
        onTreeNodeCheckChange={this._handleDynamicTreeNodePropChange.bind(this, 'checked')}
        data={this.state.treeData}
      />
    );
  }
}

CharacterMenu.propTypes = {
  //treeData: React.PropTypes.array
};

export default CharacterMenu;
