'use strict';

// Import external libraries
import React from 'react';
import {Button, Grid, Row, Col, Panel} from 'react-bootstrap';

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
    //header data
    var tempClass = [];
    for (let i=0; i<this.props.character.classes.length; i++){
      var classAndLevel = document.getElementById('csform-class-'+i).value;
      var tempArray = classAndLevel.split(' ');
      var tempObject = {
        'name' : tempArray[0],
        'level': parseInt(tempArray[1])
      };
      tempClass.push(tempObject);
    }
    this.props.character.classes = tempClass;
    this.props.character.name = document.getElementById('csform-name').value;
    this.props.character.background = document.getElementById('csform-background').value;
    this.props.character.playerName = document.getElementById('csform-Player').value;
    this.props.character.race = document.getElementById('csform-race').value;
    var tempAlign = document.getElementById('csform-alignment').value;
    this.props.character.alignment = tempAlign.split(' ');
    var tempExp = document.getElementById('csform-experience').value;
    this.props.character.experience = parseInt(tempExp);
    //equipment data
    //equipment declare

    //DiceAndSaves data
    this.props.character.hitDice = document.getElementById('csform-hitDice').value;
    this.props.character.deathSaves.successes = document.getElementById('csform-deathSucc').value;
    this.props.character.deathSaves.failures = document.getElementById('csform-deathFails').value;
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
                  {character.inspiration}
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

    let back = null;
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
