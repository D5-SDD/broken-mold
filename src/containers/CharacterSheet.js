'use strict';

// Import external libraries
import React from 'react';
import {FormGroup, FormControl, Modal, Button, Grid, Row, Col, Panel} from 'react-bootstrap';
import capital from 'to-capital-case';
import _ from 'lodash';
import fs from 'fs';
// Import internal libraries
import {
  AbilityScores, CombatStatistics, Currency, DiceAndSaves,
  Equipment, Header, HealthBox, SpellArea, TextBox
} from '../components/CharacterSheet';

import {
  CHARACTER_DIR, SPELL_CLASSES, RACES_DB, BACKGROUNDS_DB, SPELLS_DB, FEATURE_TRAITS_DB,
  findSpell, findItem, findArmor, findWeapon, findFeature
} from '../../lib/Character';

import {
  startUDPListen, stopUDPListen, closeTCPClient, TCP, DM_FOLDER
} from '../../lib/Networking';

// Import icons
import {FaArrowLeft, FaPencil} from 'react-icons/lib/fa';

// Import the stylesheet
import '../stylesheets/containers/CharacterSheet';

// The Character Sheet View for the client,
// displays data to the player during a game
class CharacterSheet extends React.Component {
  constructor(props) {
    super(props);

    var viewState = 0;
    if (this.props.character === null) {
      // create a new character
      viewState = 1;
    }

    // track if the player confirmed changes to the character sheet
    this.confirmed = null;

    this.state = {
      viewState: viewState,
      lookingForDM: false,
      connectedToDM: false,
      showModal: false,
      modalTitle: '',
      modalBody: ''
    };

    this.closeModal = this.closeModal.bind(this);
    this.closeModalAndExit = this.closeModalAndExit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.applyEdits = this.applyEdits.bind(this);
    this.validateBeforeExit = this.validateBeforeExit.bind(this);
    this.lookForDM = this.lookForDM.bind(this);
    this.disconnectFromDM = this.disconnectFromDM.bind(this);
    this.stopLookForDM = this.stopLookForDM.bind(this);
    this._reloadCB = this._reloadCB.bind(this);
  }

  //close popup and continue editing
  closeModal() {
    this.setState({
      showModal: false,
      modalTitle: '',
      modalBody: ''
    });
  }

  //close popup and exit the current character sheet
  closeModalAndExit() {
    this.setState({
      showModal: false,
      modalTitle: '',
      modalBody: ''
    });
    this.disconnectFromDM();
    this.props.exitCharacterSheetCB(false);
  }

  //open a popup message if the character is invalid
  openModal(message, title) {
    this.setState({
      showModal: true,
      modalTitle: title,
      modalBody: message
    });
  }

  //populates the edits that have been made to the appropriate variables
  applyEdits() {
    var propsCharacter = this.props.character;
    //Header data
    var classInput = $('.csform-class');
    var levelInput = $('.csform-level');
    var tempClasses = [];
    for (let i = 0; i < classInput.length; i++) {
      tempClasses.push({
        name: classInput[i].value,
        level: levelInput[i].value
      });
    }
    propsCharacter.classes = tempClasses;
    propsCharacter.name = $('#csform-name')[0].value;
    propsCharacter.background = $('#csform-background')[0].value;
    propsCharacter.playerName = $('#csform-player')[0].value;
    propsCharacter.race = $('#csform-race')[0].value;
    var tempAlign = $('#csform-alignment')[0].value;
    propsCharacter.alignment = tempAlign.split(' ');
    var tempExp = $('#csform-experience')[0].value;
    propsCharacter.experience = Math.abs(parseInt(tempExp));

    //DiceAndSaves data
    propsCharacter.hitDice = $('#csform-hitDice')[0].value;
    propsCharacter.deathSaves.successes = Math.abs($('#csform-deathSucc')[0].value);
    propsCharacter.deathSaves.failures = Math.abs($('#csform-deathFails')[0].value);
    propsCharacter.inspiration = Math.abs($('#csform-inspiration')[0].value);
    propsCharacter.speed = Math.abs($('#csform-speed')[0].value);

    //Ability Scores data
    propsCharacter.abilityScores.strength = Math.abs($('#csform-abilityscore-strength')[0].value);
    propsCharacter.abilityScores.dexterity = Math.abs($('#csform-abilityscore-dexterity')[0].value);
    propsCharacter.abilityScores.constitution = Math.abs($('#csform-abilityscore-constitution')[0].value);
    propsCharacter.abilityScores.intelligence = Math.abs($('#csform-abilityscore-intelligence')[0].value);
    propsCharacter.abilityScores.wisdom = Math.abs($('#csform-abilityscore-wisdom')[0].value);
    propsCharacter.abilityScores.charisma = Math.abs($('#csform-abilityscore-charisma')[0].value);

    //Saving Throws data
    propsCharacter.savingThrows.strength.proficient = $('#csform-savingthrow-strength')[0].checked;
    propsCharacter.savingThrows.dexterity.proficient = $('#csform-savingthrow-dexterity')[0].checked;
    propsCharacter.savingThrows.constitution.proficient = $('#csform-savingthrow-constitution')[0].checked;
    propsCharacter.savingThrows.intelligence.proficient = $('#csform-savingthrow-intelligence')[0].checked;
    propsCharacter.savingThrows.wisdom.proficient = $('#csform-savingthrow-wisdom')[0].checked;
    propsCharacter.savingThrows.charisma.proficient = $('#csform-savingthrow-charisma')[0].checked;

    //Hitpoints data
    propsCharacter.hitpoints.maximum = Math.abs($('#csform-maxhealth')[0].value);
    propsCharacter.hitpoints.current = Math.abs($('#csform-currhealth')[0].value) > propsCharacter.hitpoints.maximum
      ? propsCharacter.hitpoints.maximum
      : Math.abs($('#csform-currhealth')[0].value);
    propsCharacter.hitpoints.temporary = Math.abs($('#csform-temphealth')[0].value);

    //Textbox data
    propsCharacter.personalityTraits = $('.csform-personalityTraits')[0].value;
    propsCharacter.ideals = $('.csform-ideals')[0].value;
    propsCharacter.bonds = $('.csform-bonds')[0].value;
    propsCharacter.flaws = $('.csform-flaws')[0].value;
    propsCharacter.proficienciesAndLanguages = [];
    var profAndLang = $('.csform-ProficienciesAndLanguages');
    for (let i = 0; i < profAndLang.length; i++) {
      let item = profAndLang[i].value;
      propsCharacter.proficienciesAndLanguages.push(item);
    }

    //Skills data
    propsCharacter.skills.acrobatics.proficient = $('#csform-skill-acrobatics')[0].checked;
    propsCharacter.skills.animalHandling.proficient = $('#csform-skill-animalHandling')[0].checked;
    propsCharacter.skills.arcana.proficient = $('#csform-skill-arcana')[0].checked;
    propsCharacter.skills.athletics.proficient = $('#csform-skill-athletics')[0].checked;
    propsCharacter.skills.deception.proficient = $('#csform-skill-deception')[0].checked;
    propsCharacter.skills.history.proficient = $('#csform-skill-history')[0].checked;
    propsCharacter.skills.insight.proficient = $('#csform-skill-insight')[0].checked;
    propsCharacter.skills.intimidation.proficient = $('#csform-skill-intimidation')[0].checked;
    propsCharacter.skills.investigation.proficient = $('#csform-skill-investigation')[0].checked;
    propsCharacter.skills.medicine.proficient = $('#csform-skill-medicine')[0].checked;
    propsCharacter.skills.nature.proficient = $('#csform-skill-nature')[0].checked;
    propsCharacter.skills.perception.proficient = $('#csform-skill-perception')[0].checked;
    propsCharacter.skills.performance.proficient = $('#csform-skill-performance')[0].checked;
    propsCharacter.skills.persuasion.proficient = $('#csform-skill-persuasion')[0].checked;
    propsCharacter.skills.religion.proficient = $('#csform-skill-religion')[0].checked;
    propsCharacter.skills.sleightOfHand.proficient = $('#csform-skill-sleightOfHand')[0].checked;
    propsCharacter.skills.stealth.proficient = $('#csform-skill-stealth')[0].checked;
    propsCharacter.skills.survival.proficient = $('#csform-skill-survival')[0].checked;

    //Currency data
    _.forIn(this.props.character.currency, function(value, key) {
      var moneyValue = $('#csform-money-'+capital(key))[0].value;
      propsCharacter.currency[key] = Math.abs(parseInt(moneyValue));
    });

    //Inventory data
    propsCharacter.inventory = [];
    var inventory = $('.equipment-Equipment');
    for (let i = 0; i < inventory.length; i++) {
      let item = inventory[i].textContent;
      if (findItem(item)) {
        propsCharacter.inventory.push(item);
      }
    }

    //Armor data
    propsCharacter.armor = [];
    var armors = $('.equipment-Armor');
    for (let i = 0; i < armors.length; i++) {
      let armor = armors[i].textContent;
      if (findArmor(armor)) {
        propsCharacter.armor.push(armor);
      }
    }

    //Weapons data
    propsCharacter.weapons = [];
    var weapons = $('.equipment-Weapons');
    for (let i = 0; i < weapons.length; i++) {
      let weapon = weapons[i].textContent;
      if (findWeapon(weapon)) {
        propsCharacter.weapons.push(weapon);
      }
    }

    //SpellCasting data
    propsCharacter.spellCastingClass = $('#csform-spellclass')[0].value;
    propsCharacter.spells = [];
    var spells = $('.Spells');
    for (let i = 0; i < spells.length; i++) {
      propsCharacter.spells.push(spells[i].textContent);
    }

    // Features and Traits
    propsCharacter.featuresAndTraits = [];
    var features = $('.featuresAndTraits');
    for (let i = 0; i < features.length; i++) {
      propsCharacter.featuresAndTraits.push(features[i].textContent);
    }
  }

  //check that character has all required information before exiting
  validateBeforeExit() {
    if (!this.props.character.isCharacterValid()) {
      this.openModal('A character needs a name, class, and race in order to be saved.', 'Unable to save character');
      return;
    }
    this.disconnectFromDM();
    this.props.exitCharacterSheetCB();
  }

  //sets the state of the client so that it knows it is connected to DM
  networkCB() {
    var viewState = this.state.viewState;
    var lookingForDM = false;
    var connectedToDM = true;
    if (this.state.connectedToDM) {
      lookingForDM = false;
      connectedToDM = false;
    }
    this.setState({
      viewState: viewState,
      lookingForDM: lookingForDM,
      connectedToDM: connectedToDM
    });
  }

  //sets up UDP listening to begin process of connecting to DM
  lookForDM(charLocation) {
    if (!this.props.character.isCharacterValid()) {
      this.openModal('A character needs a name, class, and race in order to be shared.', 'Unable to share character');
      return;
    }
    this.props.character.saveCharacter(CHARACTER_DIR + this.props.character.name + '.json');
    this.props.character.originalName = this.props.character.name;
    startUDPListen(true, () => {
      this.networkCB();
    }, charLocation, () => {
      this._reloadCB();
    });
    var viewState = this.state.viewState;
    var lookingForDM = true;
    var connectedToDM = false;
    this.setState({
      viewState: viewState,
      lookingForDM: lookingForDM,
      connectedToDM: connectedToDM
    });
  }

  //stope UDP listening as the session is over
  stopLookForDM() {
    stopUDPListen();
    var viewState = this.state.viewState;
    var lookingForDM = false;
    var connectedToDM = false;
    this.setState({
      viewState: viewState,
      lookingForDM: lookingForDM,
      connectedToDM: connectedToDM
    });
  }

  //disconnects user from DM
  disconnectFromDM() {
    closeTCPClient();
    stopUDPListen();
  }

  //"forgets" the edits that have been made in this edit round
  _cancelEdit() {
    this.confirmed = false;
    var viewState = 0;
    var lookingForDM = this.state.lookingForDM;
    var connectedToDM = this.state.connectedToDM;
    this.setState({
      viewState: viewState,
      lookingForDM: lookingForDM,
      connectedToDM: connectedToDM
    });
  }

  //makes recent edits show up after they have been made and confirmed
  _makeEdit() {
    this.confirmed = true;
    var viewState = 0;
    var lookingForDM = this.state.lookingForDM;
    var connectedToDM = this.state.connectedToDM;
    this.applyEdits();
    this.props.character.updateAutoValues();
    if (this.state.connectedToDM) {
      this.props.character.saveCharacter(CHARACTER_DIR + this.props.character.name + '.json');
      this.props.character.originalName = this.props.character.name;
      TCP.client.sendMessage(JSON.parse(fs.readFileSync(CHARACTER_DIR + this.props.character.name + '.json')));
    } else if (!this.props.exitCharacterSheetCB) {
      this.props.character.saveCharacter(DM_FOLDER + this.props.character.name + '.json');
      this.props.character.originalName = this.props.character.name;
      TCP.clients[TCP.clients.indexOf(this.props.client)].sendMessage(JSON.parse(fs.readFileSync(DM_FOLDER + this.props.character.name + '.json')));
    }
    this.setState({
      viewState: viewState,
      lookingForDM: lookingForDM,
      connectedToDM: connectedToDM
    });
  }

  //reloads the callback to update the view
  _reloadCB() {
    var viewState = 0;
    var lookingForDM = this.state.lookingForDM;
    var connectedToDM = this.state.connectedToDM;
    this.props.character.importFromJSON(CHARACTER_DIR + this.props.character.name + '.json');
    this.setState({
      viewState: viewState,
      lookingForDM: lookingForDM,
      connectedToDM: connectedToDM
    });
  }

  render() {
    var character = this.props.character;
    var CS_GRID = null;

    var spellData = [];
    for (let i = 0; i < character.spells.length; i++) {
      spellData.push({
        name: character.spells[i],
        description: findSpell(character.spells[i]).description
      });
    }

    var featureData = [];
    for (let i = 0; i < character.featuresAndTraits.length; i++) {
      featureData.push({
        name: character.featuresAndTraits[i],
        description: findFeature(character.featuresAndTraits[i]).description
      });
    }

    var inspiration = character.inspiration;
    if (this.state.viewState) {
      inspiration = (
        <FormGroup>
          <FormControl id="csform-inspiration" type="number" defaultValue={character.inspiration} min="0"/>
        </FormGroup>
      );
    }
    // populate the grid that displays all the relevant information to the user
    CS_GRID = (
      <Grid className="character-sheet-grid">
        <Header
          alignment={character.alignment}
          background={character.background}
          classes={character.classes.slice()}
          confirmed={this.confirmed}
          experience={character.experience}
          name={character.name}
          playerName={character.playerName}
          race={character.race}
          racedb = {RACES_DB}
          backgrounddb = {BACKGROUNDS_DB}
          viewState={this.state.viewState}
        />
        <Row className="outer">
          <Col className="outer col" md={4}>
            <Row>
              <Col md={6}>
                <Panel header="Proficiency Bonus" className="centered">
                  {character.proficiencyBonus}
                </Panel>
              </Col>
              <Col md={6}>
                <Panel header="Inspiration" className="centered">
                  {inspiration}
                </Panel>
              </Col>
            </Row>
            <AbilityScores
              abilityScoreMods={character.abilityScoreMods}
              abilityScores={character.abilityScores}
              savingThrows={character.savingThrows}
              skills={character.skills}
              viewState={this.state.viewState}
            />
          </Col>
          <Col className="outer col" md={4}>
            <CombatStatistics
              armorClass={character.armorClass}
              initiative={character.initiative}
              speed={character.speed}
              viewState={this.state.viewState}
            />
            <HealthBox
              health={character.hitpoints}
              viewState={this.state.viewState}
            />
            <DiceAndSaves
              hitDice={character.hitDice}
              deathSaves={character.deathSaves}
              viewState={this.state.viewState}
            />
            <SpellArea
              attack={character.spellAttackMod}
              cast={character.spellCastingClass}
              save={character.spellSaveDC}
              db={SPELL_CLASSES}
              viewState={this.state.viewState}
            />
            <Row>
              <Col className="inner col" md={12}>
                <Currency
                  currency={character.currency}
                  viewState = {this.state.viewState}
                />
              </Col>
            </Row>
          </Col>
          <Col className="outer col" md={4}>
            <Row>
              <Col className="col" md={11}>
                <Row>
                  <TextBox
                    data={character.personalityTraits}
                    title="personalityTraits"
                    confirmed={this.confirmed}
                    viewState={this.state.viewState}
                  />
                </Row>
                <Row>
                  <TextBox
                    data={character.ideals}
                    title="ideals"
                    confirmed={this.confirmed}
                    viewState={this.state.viewState}
                  />
                </Row>
                <Row>
                  <TextBox
                    data={character.bonds}
                    title="bonds"
                    confirmed={this.confirmed}
                    viewState={this.state.viewState}
                  />
                </Row>
                <Row>
                  <TextBox
                    data={character.flaws}
                    title="flaws"
                    confirmed={this.confirmed}
                    viewState={this.state.viewState}
                  />
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className="col" md={11}>
                <Row>
                  <TextBox
                    accordion
                    data={featureData}
                    title="featuresAndTraits"
                    confirmed={this.confirmed}
                    db={FEATURE_TRAITS_DB}
                    viewState={this.state.viewState}
                  />
                </Row>
                <Row>
                  <TextBox
                    confirmed={this.confirmed}
                    data={[character.proficienciesAndLanguages]}
                    title="ProficienciesAndLanguages"
                    viewState={this.state.viewState}
                  />
                </Row>
              </Col>
            </Row>
          </Col>
          <Row>
            <Col className="spells" md={12}>
              <TextBox
                accordion
                data={spellData}
                title="Spells"
                db={SPELLS_DB}
                confirmed={this.confirmed}
                viewState={this.state.viewState}
              />
            </Col>
          </Row>
          <Row>
            <Col className="inventory" md={5}>
              <Equipment
                heading="Equipment"
                data={character.inventory}
                viewState={this.state.viewState}
                confirmed={this.confirmed}
              />
            </Col>
            <Col className="armor" md={7}>
              <Row>
                <Equipment
                  heading="Armor"
                  data={character.armor}
                  viewState = {this.state.viewState}
                  confirmed={this.confirmed}
                />
              </Row>
                <Equipment
                  heading="Weapons"
                  data={character.weapons}
                  viewState = {this.state.viewState}
                  confirmed={this.confirmed}
                />
            </Col>
          </Row>
        </Row>
      </Grid>
    );

    var DMButtonText = 'Connect To DM';
    var DMButtonStyle = 'primary';

    var okButton = null;
    var cancelButton = null;

    if (this.state.lookingForDM) {
      DMButtonText = 'Cancel';
      DMButtonStyle = 'danger';
    }
    if (this.state.connectedToDM) {
      DMButtonText = 'Disconnect From DM';
      DMButtonStyle = 'danger';
    }
    if (this.state.viewState) {
      cancelButton = (
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={this._cancelEdit.bind(this)}
        >
          Cancel
        </Button>
      );
      okButton = (
      <Button
          bsStyle="success"
          bsSize="small"
          onClick={this._makeEdit.bind(this)}
        >
          OK
        </Button>
      );
    }

    let back = null;
    let DMButton = null;
    if (this.props.exitCharacterSheetCB) {
      back = (
        <FaArrowLeft
          className="exit"
          onClick={this.validateBeforeExit}
        />
      );
      DMButton = (
        <Button
          bsStyle={DMButtonStyle}
          bsSize="small"
          onClick={() => {
            if (!this.state.lookingForDM && !this.state.connectedToDM) {
              this.lookForDM(this.props.character.name + '.json');
            } else if (!this.state.lookingForDM && this.state.connectedToDM) {
              this.disconnectFromDM();
            } else if (this.state.lookingForDM && !this.state.connectedToDM) {
              this.stopLookForDM();
            }
          }}
          disabled = {Boolean(this.state.viewState)}
        >
          {DMButtonText}
        </Button>
      );
    }

    
    var modalExitButton = null;
    if (this.state.modalTitle === 'Unable to save character') {
      modalExitButton = (
        <Button bsStyle="danger" onClick={this.closeModalAndExit}>Exit</Button>
      );
    }
    return (
      <div className="character-sheet">
        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{this.state.modalBody}</h4>
          </Modal.Body>
          <Modal.Footer>
            {modalExitButton}
            <Button bsStyle="primary" onClick={this.closeModal}>Continue Editing</Button>
          </Modal.Footer>
        </Modal>
        <nav className="navigation" id="header">
          {DMButton}, {okButton}, {cancelButton}
        </nav>
        {back}
        <FaPencil
          className="edit"
          onClick={() => {
            if (!this.state.lookingForDM && !this.state.viewState && !this.state.connectedToDM) {
              this.confirmed = null;
              this.setState({viewState: 1});
            }
          }}
        />
        {CS_GRID}
      </div>
    );
  }
}

CharacterSheet.propTypes = {
  exitCharacterSheetCB: React.PropTypes.func,
  character: React.PropTypes.object.isRequired,
  client:React.PropTypes.object
};

export default CharacterSheet;
