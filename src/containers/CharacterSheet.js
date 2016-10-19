'use strict';

import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import CharacterSheetSidebar from '../components/CharacterSheetSidebar';

import '../stylesheets/containers/CharacterSheet';

class CharacterSheet extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var CS_GRID = null;
    return (
      <div className="character-sheet">
        <CharacterSheetSidebar
          character={this.props.character}
          exitCharacterSheetCB={this.props.exitCharacterSheetCB}
        />
        {CS_GRID}
      </div>
    );
  }
}

CharacterSheet.propTypes = {
  exitCharacterSheetCB: React.PropTypes.func.isRequired,
  character: React.PropTypes.object.isRequired
};

export default CharacterSheet;
