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
      <div class="character-sheet">
        <CharacterSheetSidebar exitCharacterSheetCB={this.props.exitCharacterSheetCB} />
      </div>
    );
  }
}

CharacterSheet.propTypes = {
  exitCharacterSheetCB: React.PropTypes.func.isRequired
};

export default CharacterSheet;
