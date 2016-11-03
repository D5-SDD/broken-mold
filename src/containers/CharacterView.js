'use strict';

// Import libraries
import React from 'react';
import CharacterMenu from '../components/CharacterMenu';
import CharacterSheet from './CharacterSheet';

// Import internal libraries
import {exportMap, readCharactersFromMap, readMap} from '../../lib/Character';

// Import stylesheet
import '../stylesheets/containers/CharacterView';

// The Character View for the client,
// handles the character menu, view, and creation interfaces
class CharacterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewState: 0, // 0: menu, 1: view/create sheet
    }
;
    this.currentCharacter = null;

    // import the character map and read all saved characters
    this.characterMap = readMap();
    this.characters = readCharactersFromMap(this.characterMap);
  }

  // Called when the load button is clicked,
  // creates a file dialog and calls the function to import
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

  // Called when the new button is clicked,
  // TODO: create a modal for the character name, then character creation
  newCharacterCB() {
    this.currentCharacter = null;
    this.setState({
      viewState: 1
    });
  }

  // Called when a character is selected from the menu,
  // transitions the user to the character sheet view
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

  // Called when any exit button is clicked,
  // exports any changes to the characters and return to the character menu
  exitCharacterSheetCB() {
    // exportMap(this.characters);
    this.currentCharacter = null;
    this.setState({viewState: 0});
  }

  render() {
    var CV = null;

    // render the character menu or a character sheet based on current state
    if (this.state.viewState === 0) {
      CV = (
        <CharacterMenu
          characterMap={this.characterMap}
          loadCharacterCB={this.loadCharacterCB.bind(this)}
          newCharacterCB={this.newCharacterCB.bind(this)}
          selectCharacterCB={this.selectCharacterCB.bind(this)}
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

CharacterView.propTypes = {};

export default CharacterView;
