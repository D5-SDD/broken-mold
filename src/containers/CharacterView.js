'use strict';

import React from 'react';
import CharacterMenu from '../components/CharacterMenu';

import '../stylesheets/containers/CharacterView';

class CharacterView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="character-view">
        <CharacterMenu
          characterMap={this.props.characterMap}
        />
      </div>
    );
  }
}

CharacterView.propTypes = {
  characterMap: React.PropTypes.array
};

export default CharacterView;
