'use strict';

// Import libraries
import React from 'react';
import {Modal, Button} from 'react-bootstrap';

// Import internal libraries
import CharacterMenu from '../components/CharacterMenu';
import CharacterSheet from './CharacterSheet';
import Character, {
  exportMap, readMap, loadCharacters, CHARACTER_DIR
} from '../../lib/Character';

// Import stylesheet
import '../stylesheets/containers/CharacterView';

// The Character View for the client,
// handles the character menu, view, and creation interfaces
class CharacterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewState: 0, // 0: menu, 1: view/create sheet
      showModal: false
    };

    this.currentCharacter = null;

    // import the character map and read all saved characters
    exportMap();
    this.characterMap = readMap();

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  //closes popup
  closeModal() {
    this.setState({
      showModal: false
    });
  }

  //opens popup
  openModal() {
    this.setState({
      showModal: true
    });
  }

  // Called when the load button is clicked,
  // creates a file dialog and calls the function to import
  loadCharacterCB() {
    var files = $('#fileDialog')[0].files;
    var paths = [];
    for (let i = 0; i < files.length; i++) {
      paths.push(files[i].path);
    }
    if (paths.length === 0) {
      $('#fileDialog')[0].value = '';
      return;
    }
    this.currentCharacter = loadCharacters(paths);
    if (this.currentCharacter === null) {
      this.openModal();
    } else {
      this.setState({
        viewState: 1
      });
    }

    $('#fileDialog')[0].value = '';
  }

  // Called when the new button is clicked
  newCharacterCB() {
    this.currentCharacter = new Character('NEW_CHARACTER');
    this.setState({
      viewState: 1
    });
  }

  // Called when a character is selected from the menu,
  // transitions the user to the character sheet view
  selectCharacterCB(node) {
    var name = node.filename;
    this.characterMap = readMap();
    for (let i = 0; i < this.characterMap.length; i++) {
      if (this.characterMap[i].filename === name) {
        this.currentCharacter = new Character(node.filename);
        break;
      }
    }
    this.setState({
      viewState: 1
    });
  }

  // Called when any exit button is clicked,
  // exports any changes to the characters and return to the character menu
  exitCharacterSheetCB(save) {
    if (save !== false) {
      // save character
      this.currentCharacter.saveCharacter(CHARACTER_DIR + this.currentCharacter.name + '.json');
      this.currentCharacter = null;
      exportMap();
    }
    this.characterMap = readMap();
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
      <div className="character-view">
        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Unable to load character</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Invalid character JSON, try again.</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        {CV}
      </div>
    );
  }
}

CharacterView.propTypes = {};

export default CharacterView;
