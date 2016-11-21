'use strict';

// Inport libraries
import React from 'react';
import {Checkbox, FormGroup, FormControl, Col, Row, Panel} from 'react-bootstrap';
import capital from 'to-capital-case';

// Import icons
import {FaCircle, FaCircleO, FaStar, FaStarO} from 'react-icons/lib/fa';

// Import the SKILLS reference database from the Character library
import {SKILLS} from '../../lib/Character';

// Displays a character's ability scores in the Character Sheet View
// Collection of AbilityScore components
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
          viewState={this.props.viewState}
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
  skills: React.PropTypes.object.isRequired,
  viewState: React.PropTypes.number.isRequired
};

export default AbilityScores;

// Displays an individual ability score
class AbilityScore extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    var name = this.props.name;
    
    //Icon based on if you are proficient in a skill or saving throw
    var savingThrowsIcon = <FaStarO />;
    if (this.props.savingThrows.proficient === true) {
      savingThrowsIcon = <FaStar />;
    }

    var savingThrowBox = (
      <span className="saving-throws">
        {savingThrowsIcon} {this.props.savingThrows.value} Saving Throws
      </span>
    );
    // If editing, make checkboxes
    if (this.props.viewState) {
      savingThrowBox = (
        <form>
          <Checkbox
            id={'csform-savingthrow-' + name}
            defaultChecked={this.props.savingThrows.proficient}
          >
            Saving Throws
          </Checkbox>
        </form>
      );
    }
    var skills = [];
    if (this.props.viewState) {
      for (let i = 0; i < SKILLS[name].length; i++) {
        let skill = SKILLS[name][i];
        skills.push(
          <div key={skill}>
            <form>
              <Checkbox
                id={'csform-skill-' + skill}
                defaultChecked={this.props.skills[skill].proficient}
              >
                {capital(skill)}
              </Checkbox>
            </form>
          </div>
        );
      }
    } else {
      for (let i = 0; i < SKILLS[name].length; i++) {
        let skill = SKILLS[name][i];
        let icon = <FaCircleO />;
        if (this.props.skills[skill].proficient === true) {
          icon = <FaCircle />;
        }

        let skillName = capital(skill);
        skills.push(<div key={skill}>{icon} {this.props.skills[skill].value} {skillName}</div>);
      }
    }

    var mod = this.props.mod;
    if (mod >= 0) {
      mod = '+' + this.props.mod;
    }

    var abilityScoreBox = (
      <Panel header={capital(name)} className="centered">
        <div className='ability-score value'>
          {this.props.value}
        </div>
        <div className='ability-score mod'>
          {mod}
        </div>
      </Panel>
    );
    if (this.props.viewState) {
      abilityScoreBox = (
        <Panel header={capital(name)} className="centered">
          <FormGroup>
            <FormControl
              id={'csform-abilityscore-' + name}
              type="number"
              defaultValue={this.props.value}
              min="0"
              max="20"
            />
          </FormGroup>
        </Panel>
      );
    }

		return (
      <Row className="ability-score" id={name} >
        <Col className="col" md={4}>
          {abilityScoreBox}
        </Col>
        <Col className="col" md={8}>
          <Panel>
            {savingThrowBox}
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
  value: React.PropTypes.number.isRequired,
  viewState: React.PropTypes.number.isRequired
};
