'use strict';

import React from 'react';
import {Row, Col, Panel} from 'react-bootstrap';
import {
  FaStar, FaStarO, FaCircle, FaCircleO,
  FaShield, FaHeart, FaHeartO, FaGittip,
  FaHeartbeat, FaMedkit
} from 'react-icons/lib/fa';

import {SKILLS} from '../../lib/Character';

import '../stylesheets/components/CharacterSheet';

export class AbilityScore extends React.Component {
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
      let icon = <FaCircle />;
      if (this.props.skills[skill].proficient === true) {
        icon = <FaCircle />;
      }

      // convert from camelCase to Camel Case
      let skillName = skill.replace(/([A-Z])/g, ' $1');
      skillName = skillName.charAt(0).toUpperCase() + skillName.slice(1);

      skills.push(<div key={skill}>{icon} {this.props.skills[skill].value} {skillName}</div>);
    }

		return (
      <Row className="ability-score" id={name} >
        <Col className="col" md={4}>
          <Panel header={name} className="centered">
            <div className='ability-score value'>
              {this.props.value}
            </div>
            <div className='ability-score mod'>
              {this.props.mod}
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

export class HealthBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    var heartIcon = <FaHeartO />;
    var healthIcon = <FaHeart />;
    var tempIcon = <FaHeartbeat />;

    return (
      <Row className="healthBox" >
        <Panel>
          <Col className="col" md={4}>
            <Panel className="centered">
              {healthIcon} Max Health: {this.props.health.maximum}
            </Panel>
          </Col>
          <Col className="col" md={4}>
            <Panel className="centered">
              {heartIcon} Current Health: {this.props.health.current}
            </Panel>
          </Col>
          <Col className="col" md={4}>
            <Panel className="centered">
              {tempIcon} Temp Health: {this.props.health.temporary}
            </Panel>
          </Col>
        </Panel>
      </Row>
    );
	}
}

HealthBox.propTypes = {
  health: React.PropTypes.object.isRequired
};

export class DiceAndSaves extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    var hitDiceIcon = <FaGittip />;
    var deathIcon = <FaMedkit />;

    return (
      <Row className="DiceAndSaves" >
        <Col className="col" md={4}>
          <Panel className="centered">
            {hitDiceIcon} Hit Dice: {this.props.hitDice}
          </Panel>
        </Col>
        <Col className="col" md={8}>
          <Panel className="centered">
            {deathIcon} Successes: <DeathSavesHelper
              saves={this.props.deathSaves.successes}
              deathKey="deathsucc"
            />
            <br/>
            {deathIcon} Failures: <DeathSavesHelper
              saves={this.props.deathSaves.failures}
              deathKey="deathfail"
            />
            <br/>
            Death Saves
          </Panel>
        </Col>
      </Row>
    );
  }
}

DiceAndSaves.propTypes = {
  deathSaves: React.PropTypes.object.isRequired,
  hitDice: React.PropTypes.string.isRequired
};

class DeathSavesHelper extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    var deathSaves = [];
    var deathKey = this.props.deathKey;

    for (let i = 0; i < 3; i++) {
      if (i < this.props.saves){
        deathSaves.push(<text key={deathKey+i}><FaCircle /></text>);
      } else {
        deathSaves.push(<text key={deathKey+i}><FaCircleO /></text>);
      }
    }

    return (
      <text key={deathKey}>
        {deathSaves}
      </text>
    );
  }
}

DeathSavesHelper.propTypes = {
  deathKey: React.PropTypes.string.isRequired,
  saves: React.PropTypes.number.isRequired
};

export class SpellArea extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    return (
      <Row className="SpellArea" >
        <Col className="col" md={4}>
          <Panel className="centered">
            Spell-Casting Ability: {this.props.cast}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <Panel className="centered">
            Spell Save DC: {this.props.save}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <Panel className="centered">
            Spell Attack Bonus: {this.props.attack}
          </Panel>
        </Col>
      </Row>
    );
  }
}

SpellArea.propTypes = {
  cast: React.PropTypes.string.isRequired,
  attack: React.PropTypes.number.isRequired,
  save: React.PropTypes.number.isRequired
};

export class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Row className="Header" >
        <Col className="col" md={4}>
          <Panel className="centered">
            Character Name: {this.props.name}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <div>
          
          </div>
        </Col>
      </Row>
    );
  }
}

Header.propTypes = {
  name: React.PropTypes.string.isRequired
};
