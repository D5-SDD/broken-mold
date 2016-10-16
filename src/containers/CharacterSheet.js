'use strict';

import React from 'react';

import '../stylesheets/containers/CharacterSheet';

class CharacterSheet extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div onClick={this.props.exitCharacterSheetCB}>
        <i className="fa fa-arrow-left fa-3x" aria-hidden="true"/>
      </div>
    );
  }
}

CharacterSheet.propTypes = {
  exitCharacterSheetCB: React.PropTypes.func.isRequired
};

export default CharacterSheet;
