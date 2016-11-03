/*
  What does this class do?
*/

'use strict';

// Inport libraries
import React from 'react';
import {Col, Row, Panel} from 'react-bootstrap';
import capital from 'to-capital-case';

// Import icons
import {FaCircle, FaCircleO, FaStar, FaStarO} from 'react-icons/lib/fa';

// Import the SKILLS reference database from the Character library
import {SKILLS} from '../../lib/Character';

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

export default AbilityScores;

class AbilityScore extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    var name = this.props.name;
    var savingThrowsIcon = <FaStarO />;
    if (this.props.savingThrows.proficient === true) {
      savingThrowsIcon = <FaStar />;
    }

    var skills = [];
    for (let i = 0; i < SKILLS[name].length; i++) {
      let skill = SKILLS[name][i];
      let icon = <FaCircleO />;
      if (this.props.skills[skill].proficient === true) {
        icon = <FaCircle />;
      }

      let skillName = capital(skill);
      skills.push(<div key={skill}>{icon} {this.props.skills[skill].value} {skillName}</div>);
    }

    var mod = this.props.mod;
    if (mod >= 0) {
      mod = '+' + this.props.mod;
    }

		return (
      <Row className="ability-score" id={name} >
        <Col className="col" md={4}>
          <Panel header={capital(name)} className="centered">
            <div className='ability-score value'>
              {this.props.value}
            </div>
            <div className='ability-score mod'>
              {mod}
            </div>
          </Panel>
        </Col>
        <Col className="col" md={8}>
          <Panel>
            <span className="saving-throws">
              {savingThrowsIcon} {this.props.savingThrows.value} Saving Throws
            </span>
            <div className="skills">
              {skills}
            </div>
          </Panel>
        </Col>
      </Row>
		);
	}
}

AbilityScore.propTypes = {
  mod: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  savingThrows: React.PropTypes.object.isRequired,
  skills: React.PropTypes.object.isRequired,
  value: React.PropTypes.number.isRequired
};
