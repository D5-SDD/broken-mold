'use strict';

import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import {AbilityScore, HealthBox, SpellArea, DiceAndSaves}
  from '../components/CharacterSheet';

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
          <Row>
            <Col className="col" md={4}>
              <AbilityScores
                abilityScores={character.abilityScores}
                savingThrows={character.savingThrows}
                skills={character.skills}
              />
            </Col>
            <Col className="col" md={4}>
              <HealthBox
                health={character.hitpoints}
              />
              <DiceAndSaves
                hitDice={character.hitDice}
                deathSaves={character.deathSaves}
              />
              <SpellArea
                cast={character.hitDice}
                save={character.hitDice}
                attack={character.hitDice}
              />
            </Col>
            <Col className="col" md={4}>
              <p>Feats and Features</p>
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
  abilityScores: React.PropTypes.object.isRequired,
  savingThrows: React.PropTypes.object.isRequired,
  skills: React.PropTypes.object.isRequired
};
