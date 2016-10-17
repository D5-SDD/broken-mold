'use strict';

import React from 'react';
import CharacterMenu from '../components/CharacterMenu';
import CharacterSheet from './CharacterSheet';

import '../stylesheets/containers/CharacterView';

class CharacterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewState: 0, // 0: character menu, 1: character sheet
      currentCharacter: null
    };

    this.selectCharacterCB = this.selectCharacterCB.bind(this);
    //this.exitCharacterSheetCB = this.exitCharacterSheetCB.bind(this);
  }

  selectCharacterCB(node) {
    var char;
    for (let i = 0; i < this.props.characterMap.length; i++) {
      if (this.props.characterMap[i].label === node.label) {
        char = this.props.characterMap[i];
        break;
      }
    }

    this.setState({viewState: 1, currentCharacter: char});
  }

  exitCharacterSheetCB() {
    this.setState({viewState: 0, currentCharacter: null});
  }

  render() {
    var CV;
    if (this.state.viewState === 0) {
      CV = (
        <CharacterMenu
          characterMap={this.props.characterMap}
          selectCharacterCB={this.selectCharacterCB}
        />
      );
    } else if (this.state.viewState === 1) {
      CV = (
        <CharacterSheet
          currentCharacter={this.state.currentCharacter}
          exitCharacterSheetCB={this.exitCharacterSheetCB.bind(this)}
        />
      );
    }
    return (
      <div className="character-view">{CV}</div>
    );
  }
}

CharacterView.propTypes = {
  characterMap: React.PropTypes.array
};

export default CharacterView;
