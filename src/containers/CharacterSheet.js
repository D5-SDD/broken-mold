'use strict';

// Import external libraries
import React from 'react';
import {FormGroup, FormControl, Button, Grid, Row, Col, Panel} from 'react-bootstrap';
import capital from 'to-capital-case';
import _ from 'lodash';

// Import internal libraries
import {
  AbilityScores, CombatStatistics, Currency, DiceAndSaves,
  Equipment, Header, HealthBox, SpellArea, TextBox
} from '../components/CharacterSheet';

import {
  startUDPListen, stopUDPListen, closeTCPClient
} from '../../lib/Networking.js';

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

    this.state = {
      viewState: viewState,
      lookingForDM: false,
      connectedToDM: false
    };

    this.applyEdits = this.applyEdits.bind(this);
    this.validateBeforeExit = this.validateBeforeExit.bind(this);
    this.lookForDM = this.lookForDM.bind(this);
    this.disconnectFromDM = this.disconnectFromDM.bind(this);
    this.stopLookForDM = this.stopLookForDM.bind(this);
  }

  applyEdits() {
    var propsCharacter = this.props.character;
    //Header data
    var tempClass = [];
    for (let i=0; i<this.props.character.classes.length; i++){
      var classAndLevel = document.getElementById('csform-class-'+i).value;
      var tempArray = classAndLevel.split(' ');
      var tempObject = {
        "name" : tempArray[0],
        "level": Math.abs(parseInt(tempArray[1]))
      }
      tempClass.push(tempObject);
    }
    propsCharacter.classes = tempClass;
    propsCharacter.name = document.getElementById('csform-name').value;
    propsCharacter.background = document.getElementById('csform-background').value;
    propsCharacter.playerName = document.getElementById('csform-player').value;
    propsCharacter.race = document.getElementById('csform-race').value;
    var tempAlign = document.getElementById('csform-alignment').value;
    propsCharacter.alignment = tempAlign.split(' ');
    var tempExp = document.getElementById('csform-experience').value;
    propsCharacter.experience = Math.abs(parseInt(tempExp));

    //DiceAndSaves data
    propsCharacter.hitDice = document.getElementById('csform-hitDice').value;
    propsCharacter.deathSaves.successes = Math.abs(document.getElementById('csform-deathSucc').value);
    propsCharacter.deathSaves.failures = Math.abs(document.getElementById('csform-deathFails').value);
    propsCharacter.inspiration = Math.abs(document.getElementById('csform-inspiration').value);
    propsCharacter.speed = Math.abs(document.getElementById('csform-speed').value);
    
    //Ability Scores data
    propsCharacter.abilityScores.strength = Math.abs(document.getElementById('csform-abilityscore-strength').value);
    propsCharacter.abilityScores.dexterity = Math.abs(document.getElementById('csform-abilityscore-dexterity').value);
    propsCharacter.abilityScores.constitution = Math.abs(document.getElementById('csform-abilityscore-constitution').value);
    propsCharacter.abilityScores.intelligence = Math.abs(document.getElementById('csform-abilityscore-intelligence').value);
    propsCharacter.abilityScores.wisdom = Math.abs(document.getElementById('csform-abilityscore-wisdom').value);
    propsCharacter.abilityScores.charisma = Math.abs(document.getElementById('csform-abilityscore-charisma').value);
    
    //Saving Throws data
    propsCharacter.savingThrows.strength.proficient = document.getElementById('csform-savingthrow-strength').checked;
    propsCharacter.savingThrows.dexterity.proficient = document.getElementById('csform-savingthrow-dexterity').checked;
    propsCharacter.savingThrows.constitution.proficient = document.getElementById('csform-savingthrow-constitution').checked;
    propsCharacter.savingThrows.intelligence.proficient = document.getElementById('csform-savingthrow-intelligence').checked;
    propsCharacter.savingThrows.wisdom.proficient = document.getElementById('csform-savingthrow-wisdom').checked;
    propsCharacter.savingThrows.charisma.proficient = document.getElementById('csform-savingthrow-charisma').checked;
    
    //Hitpoints data
    propsCharacter.hitpoints.maximum = Math.abs(document.getElementById('csform-maxhealth').value);
    propsCharacter.hitpoints.current = Math.abs(document.getElementById('csform-currhealth').value);
    propsCharacter.hitpoints.temporary = Math.abs(document.getElementById('csform-temphealth').value);
    
    //Textbox data
    console.log(document.getElementById('csform-personalityTraits').value);
    propsCharacter.personalityTraits = document.getElementById('csform-personalityTraits').value;
    console.log(propsCharacter.personalityTraits);
    propsCharacter.ideals = document.getElementById('csform-ideals').value;
    propsCharacter.bonds = document.getElementById('csform-bonds').value;
    propsCharacter.flaws = document.getElementById('csform-flaws').value;
    
    //Skills data
    propsCharacter.skills.acrobatics.proficient = document.getElementById('csform-skill-acrobatics').checked;
    propsCharacter.skills.animalHandling.proficient = document.getElementById('csform-skill-animalHandling').checked;
    propsCharacter.skills.arcana.proficient = document.getElementById('csform-skill-arcana').checked;
    propsCharacter.skills.athletics.proficient = document.getElementById('csform-skill-athletics').checked;
    propsCharacter.skills.deception.proficient = document.getElementById('csform-skill-deception').checked;
    propsCharacter.skills.history.proficient = document.getElementById('csform-skill-history').checked;
    propsCharacter.skills.insight.proficient = document.getElementById('csform-skill-insight').checked;
    propsCharacter.skills.intimidation.proficient = document.getElementById('csform-skill-intimidation').checked;
    propsCharacter.skills.investigation.proficient = document.getElementById('csform-skill-investigation').checked;
    propsCharacter.skills.medicine.proficient = document.getElementById('csform-skill-medicine').checked;
    propsCharacter.skills.nature.proficient = document.getElementById('csform-skill-nature').checked;
    propsCharacter.skills.perception.proficient = document.getElementById('csform-skill-perception').checked;
    propsCharacter.skills.performance.proficient = document.getElementById('csform-skill-performance').checked;
    propsCharacter.skills.persuasion.proficient = document.getElementById('csform-skill-persuasion').checked;
    propsCharacter.skills.religion.proficient = document.getElementById('csform-skill-religion').checked;
    propsCharacter.skills.sleightOfHand.proficient = document.getElementById('csform-skill-sleightOfHand').checked;
    propsCharacter.skills.stealth.proficient = document.getElementById('csform-skill-stealth').checked;
    propsCharacter.skills.survival.proficient = document.getElementById('csform-skill-survival').checked;
    
    //Currency data
    _.forIn(this.props.character.currency, function(value, key) {
      var moneyValue = document.getElementById('csform-money-'+capital(key)).value;
      propsCharacter.currency[key] = Math.abs(parseInt(moneyValue));
    });
  }

  validateBeforeExit() {
    if (!this.props.character.isCharacterValid()) {
      // TODO: Pop up window saying character can't be saved
      console.log('Character could not be saved');
      return;
    }
    this.disconnectFromDM();
    this.props.exitCharacterSheetCB();
  }

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

  lookForDM(charLocation) {
    if (!this.props.character.isCharacterValid()) {
      console.log('Can\'t be shared till savable');
      return;
    }
    this.props.character.saveCharacter();
    this.props.character.originalName = this.props.character.name;
    startUDPListen(true, () => {
      this.networkCB();
    }, charLocation);
    var viewState = this.state.viewState;
    var lookingForDM = true;
    var connectedToDM = false;
    this.setState({
      viewState: viewState,
      lookingForDM: lookingForDM,
      connectedToDM: connectedToDM
    });
  }

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

  disconnectFromDM() {
    closeTCPClient();
    stopUDPListen();
  }

  _cancelEdit() {
    var viewState = 0;
    var lookingForDM = this.state.lookingForDM;
    var connectedToDM = this.state.connectedToDM;
    console.log(this.props.character.inventory);
    this.setState({
      viewState: viewState,
      lookingForDM: lookingForDM,
      connectedToDM: connectedToDM
    });
  }

  _makeEdit() {
    var viewState = 0;
    var lookingForDM = false;
    var connectedToDM = false;
    this.applyEdits();
    this.props.character.updateAutoValues();
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
        description: character.getSpellFromName(character.spells[i]).description
      });
    }
    
    var inspiration = character.inspiration;
    
    if (this.state.viewState) {
      inspiration = (
        <FormGroup>
          <FormControl id="csform-inspiration" type="number" defaultValue={character.inspiration} />
        </FormGroup>
      );
    }

    // populate the grid that displays all the relevant information to the user
    CS_GRID = (
      <Grid className="character-sheet-grid">
        <Header
          alignment={character.alignment}
          background={character.background}
          classes={character.classes}
          experience={character.experience}
          name={character.name}
          playerName={character.playerName}
          race={character.race}
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
              viewState={this.state.viewState}
            />
            <Row>
              <Col className="inner col" md={5}>
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
                    viewState={this.state.viewState}
                  />
                </Row>
                <Row>
                  <TextBox
                    data={character.ideals}
                    title="ideals"
                    viewState={this.state.viewState}
                  />
                </Row>
                <Row>
                  <TextBox
                    data={character.bonds}
                    title="bonds"
                    viewState={this.state.viewState}
                  />
                </Row>
                <Row>
                  <TextBox
                    data={character.flaws}
                    title="flaws"
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
                    data={character.featuresAndTraits}
                    title="featuresAndTraits"
                    viewState={this.state.viewState}
                  />
                </Row>
                <Row>
                  <TextBox
                    data={[character.proficiencies, character.languages]}
                    title="otherProficienciesAndLanguages"
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
              />
            </Col>
            <Col className="armor" md={7}>
              <Row>
                <Equipment
                  heading="Armor"
                  data={character.armor}
                  viewState = {this.state.viewState}
                />
              </Row>
                <Equipment
                  heading="Weapons"
                  data={character.weapons}
                  viewState = {this.state.viewState}
                />
            </Col>
          </Row>
        </Row>
      </Grid>
    );

    var back = null;
    if (this.props.exitCharacterSheetCB) {
      back = (
        <FaArrowLeft
          className="exit"
          onClick={this.validateBeforeExit}
        />
      );
    }

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
    return (
      <div className="character-sheet">
        <nav className="navigation" id="header">
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
          {okButton}, {cancelButton}
        </nav>
        {back}
        <FaPencil
          className="edit"
          onClick={() => {
            if (!this.state.lookingForDM && !this.state.connectedToDM && !this.state.viewState) {
              // FOR NOW, THIS TOGGLES, SAVE AND CANCEL BUTTONS SHOULD BE MADE
              if (this.state.viewState === 0) {
                this.setState({viewState: 1});
              } else {
                this.applyEdits();
                this.setState({viewState: 0});
              }
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
  character: React.PropTypes.object.isRequired
};

export default CharacterSheet;
