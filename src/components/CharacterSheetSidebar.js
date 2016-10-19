'use strict';

import React from 'react';

class CharacterSheetSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sidebar">
        <div onClick={this.props.exitCharacterSheetCB}>
          <i className="fa fa-arrow-left fa-3x" id="back" aria-hidden="true"/>
        </div>
      </div>
    );
  }
}

CharacterSheetSidebar.propTypes = {
  exitCharacterSheetCB: React.PropTypes.func.isRequired,
  character: React.PropTypes.object.isRequired
};

export default CharacterSheetSidebar;