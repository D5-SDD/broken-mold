'use strict';

import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
<<<<<<< HEAD
import {AbilityScore, HealthBox, SpellArea, DiceAndSaves, Header} from '../components/CharacterSheet';
=======
import {
  AbilityScore, Currency, DiceAndSaves,
  Equipment, HealthBox, SpellArea, TextBox
} from '../components/CharacterSheet';
>>>>>>> 67db7af1de5bf1e3c993b5df48a7dfaec38fc7ba

import '../stylesheets/containers/CharacterSheet';

export default class CharacterSheet extends React.Component {
  constructor(props) {
    super(props);

    var viewState = 0;
    if (this.props.character === null) {
      viewState = 1;
    }

    this.state = {
      viewState: viewState
    };

    console.log(this.props.character);
  }

  render() {
    var character = this.props.character;
    var CS_GRID = null;
    if (this.state.viewState === 0) {
      // TODO: Character View
      CS_GRID = (
        <Grid className="character-sheet-grid">
          <Header
            name={character.name}
          />
          <Row className="outer">
            <Col className="outer col" md={4}>
              <AbilityScores
                abilityScoreMods={character.abilityScoreMods}
                abilityScores={character.abilityScores}
                savingThrows={character.savingThrows}
                skills={character.skills}
              />
            </Col>
            <Col className="outer col" md={4}>
              <HealthBox
                health={character.hitpoints}
              />
              <DiceAndSaves
                hitDice={character.hitDice}
                deathSaves={character.deathSaves}
              />
              <SpellArea
                cast={character.spellCastingClass}
                save={character.spellSaveDC}
                attack={character.spellAttackMod}
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
                      data={character.featuresAndTraits}
                      title="featuresAndTraits"
                      accordion
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
    } else {
      // TODO: Character creation
    }

    return (
      <div className="character-sheet">
        {CS_GRID}
      </div>
    );
  }
}

CharacterSheet.propTypes = {
  exitCharacterSheetCB: React.PropTypes.func.isRequired,
  character: React.PropTypes.object
};

class AbilityScores extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var abilityScores = [];
    for (let abilityScore in this.props.abilityScores) {
      abilityScores.push(
        <AbilityScore
          key={abilityScore}
          mod={this.props.abilityScoreMods[abilityScore]}
          name={abilityScore}
          savingThrows={this.props.savingThrows[abilityScore]}
          skills={this.props.skills}
          value={this.props.abilityScores[abilityScore]}
        />
      );
    }

    return (
      <div className="ability-scores">
        {abilityScores}
      </div>
    );
  }
}

AbilityScores.propTypes = {
  abilityScoreMods: React.PropTypes.object.isRequired,
  abilityScores: React.PropTypes.object.isRequired,
  savingThrows: React.PropTypes.object.isRequired,
  skills: React.PropTypes.object.isRequired
};
