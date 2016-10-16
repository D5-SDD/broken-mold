'use strict';

import React from 'react';
import CharacterMenu from '../components/CharacterMenu';

import '../stylesheets/containers/CharacterView';

class CharacterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewState: 0 // 0: character menu
    };

    this.selectCharacterCB = this.selectCharacterCB.bind(this);
  }

  selectCharacterCB() {
    console.log('selectCharacterCB');
    console.log(this.state.viewState);
  }

  render() {
    return (
      <div className="character-view">
        <CharacterMenu
          characterMap={this.props.characterMap}
          selectCharacterCB={this.selectCharacterCB}
        />
      </div>
    );
  }
}

CharacterView.propTypes = {
  characterMap: React.PropTypes.array
};

export default CharacterView;
