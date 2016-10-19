'use strict';

import React from 'react';
import CharacterMenu from '../components/CharacterMenu';
import CharacterSheet from './CharacterSheet';

import Character, {loadCharacters, readMap, readCharactersFromMap} from '../../lib/Character';

import '../stylesheets/containers/CharacterView';

class CharacterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewState: 0, // 0: character menu, 1: character sheet
    };

    this.currentCharacter = null;
    this.characterMap = readMap();
    this.characters = readCharactersFromMap();
  }

  selectCharacterCB(node) {
    var name = node.filename.slice(0, -5);
    for (let char in this.characters) {
      if (this.characters[char].name === name) {
        this.currentCharacter = this.characters[char];
        break;
      }
    }
    this.setState({
      viewState: 1
    });
  }

  exitCharacterSheetCB() {
    this.currentCharacter = null;
    this.setState({viewState: 0});
  }

  loadCharacterCB() {
    var chooser = $('#fileDialog');
    chooser.unbind('change');
    chooser.on('change', function() {
      var files = $(this)[0].files;
      var paths = [];
      for (let i = 0; i < files.length; i++) {
        paths.push(files[i].path);
      }
      loadCharacters(paths);
    });
    chooser.trigger('click');
  }

  render() {
    var CV = null;
    if (this.state.viewState === 0) {
      CV = (
        <CharacterMenu
          characterMap={this.characterMap}
          selectCharacterCB={this.selectCharacterCB.bind(this)}
          loadCharacterCB={this.loadCharacterCB.bind(this)}
        />
      );
    } else if (this.state.viewState === 1) {
      CV = (
        <CharacterSheet
          character={this.currentCharacter}
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
};

export default CharacterView;
