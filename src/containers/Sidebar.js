'use strict';

import React from 'react';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true
    };
  }

  show() {
    this.setState({visible: true});
    document.addEventListener('click', this.hide.bind(this));
  }

  hide() {
    document.removeEventListener('click', this.hide.bind(this));
    this.setState({visible: false});
  }

  render() {
    var sidebarName = this.props.alignment;
    if (this.state.visible) {
      sidebarName = 'visible ' + sidebarName;
    }

    return (
      <div className="sidebar">
        <div className={sidebarName}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  children: React.PropTypes.node.isRequired,
  alignment: React.PropTypes.string,
};

Sidebar.defaultProps = {
  alignment: 'left'
};

export default Sidebar;
