'use strict';

import React from 'react';
import CharacterSheetSidebar from '../components/CharacterSheetSidebar';

import '../stylesheets/containers/CharacterSheet';

class CharacterSheet extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CharacterSheetSidebar exitCharacterSheetCB={this.props.exitCharacterSheetCB} />
    );
  }
}

CharacterSheet.propTypes = {
  exitCharacterSheetCB: React.PropTypes.func.isRequired
};

export default CharacterSheet;
