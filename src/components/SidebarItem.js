'use strict';

import React from 'react';

class SidebarItem extends React.Component {
  constructor(props) {
    super(props);
  }

  navigate(hash) {
    window.location.hash = hash;
  }

  render() {
    return (
      <div
        className="sidebar-item"
        onClick={this.navigate.bind(this, this.props.hash)}
      >
        {this.props.children}
      </div>
    );
  }
}

SidebarItem.propTypes = {
  children: React.PropTypes.node.isRequired,
  hash: React.PropTypes.string,
};

SidebarItem.defaultProps = {
  hash: ''
};

export default SidebarItem;
