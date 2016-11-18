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
  UDP, TCP, startUDPListen, stopUDPListen, startTCPClient, closeTCPClient
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
//need help with this class array
    //this.props.character.class = document.getElementById('csform-class').value;
    this.props.character.name = document.getElementById('csform-name').value;
    this.props.character.background = document.getElementById('csform-background').value;
    this.props.character.playerName = document.getElementById('csform-Player').value;
    this.props.character.race = document.getElementById('csform-race').value;
//alignment needs revision too
    //this.props.character.alignment = document.getElementById('csform-alignment').value;
    var tempExp = document.getElementById('csform-experience').value;
    this.props.character.experience = parseInt(tempExp);
    
    //equipment data
    //equipment declare
    
    //DiceAndSaves data
    
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

  render() {
    var character = this.props.character;
    var CS_GRID = null;

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
            />
          </Col>
          <Col className="outer col" md={4}>
            <CombatStatistics
              armorClass={character.armorClass}
              initiative={character.initiative}
              speed={character.speed}
            />
            <HealthBox
              health={character.hitpoints}
            />
            <DiceAndSaves
              hitDice={character.hitDice}
              deathSaves={character.deathSaves}
            />
            <SpellArea
              attack={character.spellAttackMod}
              cast={character.spellCastingClass}
              save={character.spellSaveDC}
            />
            <Row>
              <Col className="inner col" md={5}>
                <Currency currency={character.currency}/>
              </Col>
              <Col className="inner col" md={7}>
                <Equipment
                  data={[character.inventory, character.armor]}
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
                  />
                </Row>
                <Row>
                  <TextBox
                    data={character.ideals}
                    title="ideals"
                  />
                </Row>
                <Row>
                  <TextBox
                    data={character.bonds}
                    title="bonds"
                  />
                </Row>
                <Row>
                  <TextBox
                    data={character.flaws}
                    title="flaws"
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
                  />
                </Row>
                <Row>
                  <TextBox
                    data={[character.proficiencies, character.languages]}
                    title="otherProficienciesAndLanguages"
                  />
                </Row>
              </Col>
            </Row>
          </Col>
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
    var DMButtonStyle = "primary";
    
    if (this.state.lookingForDM) {
      DMButtonText = 'Cancel';
      DMButtonStyle = "danger";
    }
    if (this.state.connectedToDM) {
      DMButtonText = 'Disconnect From DM';
    }
    return (
      <div className="character-sheet">
        <nav className="navigation" id="header">
          <Button
            bsStyle={DMButtonStyle}
            bsSize="small"
            onClick={() => {
              if (!this.state.lookingForDM && !this.state.connectedToDM) {
                this.lookForDM(this.props.character.originalName + '.json');
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
        </nav>
        {back}
        <FaPencil
          className="edit"
          onClick={() => {
            if (!this.state.lookingForDM) {
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
