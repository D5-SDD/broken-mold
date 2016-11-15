'use strict';

// Import external libraries
import React from 'react';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

// Import internal libraries
import {
  AbilityScores, CombatStatistics, Currency, DiceAndSaves,
  Equipment, Header, HealthBox, SpellArea, TextBox
} from '../components/CharacterSheet';

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
      viewState: viewState
    };

    this.applyEdits = this.applyEdits.bind(this);
  }

  applyEdits() {
    this.props.character.name = document.getElementById('csform-name').value;
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

    return (
      <div className="character-sheet">
        <FaArrowLeft
          className="exit"
          onClick={this.props.exitCharacterSheetCB}
        />
        <FaPencil 
          className="edit"
          onClick={() => {
            // FOR NOW, THIS TOGGLES, SAVE AND CANCEL BUTTONS SHOULD BE MADE
            if (this.state.viewState === 0) {
              this.setState({viewState: 1});
            } else {
              this.applyEdits();
              this.setState({viewState: 0});
            }
          }}
        />
        {CS_GRID}
      </div>
    );
  }
}

CharacterSheet.propTypes = {
  exitCharacterSheetCB: React.PropTypes.func.isRequired,
  character: React.PropTypes.object.isRequired
};

export default CharacterSheet;
