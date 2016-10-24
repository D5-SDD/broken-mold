'use strict';

import React from 'react';
import {Grid, Row, Col, Panel} from 'react-bootstrap';
import {AbilityScore} from '../components/CharacterSheet';

import '../stylesheets/containers/CharacterSheet';

class CharacterSheet extends React.Component {
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
    var CS_GRID = null;
    if (this.state.viewState === 0) {
      // TODO: Character View
      var strengthData = {};
      strengthData.value = this.props.character.abilityScores.strength;
      strengthData.savingThrows = this.props.character.savingThrows.strength;
      CS_GRID = (
        <Grid className="character-sheet-grid">
          <Row>
            <Col className="col" md={4}>
              <Panel header="Proficiency Bonus">{this.props.character.proficiencyBonus}</Panel>
              <Panel header="Inspiration">{this.props.character.inspiration}</Panel>
              <AbilityScore name="Strength" scoreData={strengthData} />
            </Col>
            <Col className="col" md={4}>
              <p>Health and Attacks</p>
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

export default CharacterSheet;
