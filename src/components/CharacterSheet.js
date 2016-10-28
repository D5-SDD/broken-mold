'use strict';

import React from 'react';
import {Row, Col, Panel} from 'react-bootstrap';

import {SKILLS} from '../../lib/Character';

import '../stylesheets/components/CharacterSheet';

const ICONS = {
  savingThrows: {
    true: 'star',
    false: 'star-o'
  },
  skill: {
    true: 'circle',
    false: 'circle-o'
  },
  armor: 'shield',
  health: {
    true: 'heart',
    false: 'heart-o'
  },
  hitDice: 'gittip',
  heartBeat: 'heartbeat',
  deathIcon: 'medkit'
};

function getIcon(name, data) {
  //console.log(name, data);
  if (data !== undefined) {
    return (<i className={'fa fa-' + ICONS[name][data]} aria-hidden="true"/>);
  } else if (name !== undefined) {
    return (<i className={'fa fa-' + ICONS[name]} aria-hidden="true"/>);
  } else {
    return (<i className="fa fa-question" aria-hidden="true"/>);
  }
}

export class AbilityScore extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    var name = this.props.name;
    var savingThrowsIcon = getIcon('savingThrows', this.props.savingThrows.proficient);
    var skills = [];
    for (let i = 0; i < SKILLS[name].length; i++) {
      let skill = SKILLS[name][i];
      let icon = getIcon('skill', this.props.skills[skill].proficient);
      let skillName = skill.charAt(0).toUpperCase() + skill.slice(1);
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

export class HealthBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    var heartIcon = getIcon('health',false);
    var healthIcon = getIcon('health',true);
    var tempIcon = getIcon('heartBeat');
    
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

export class DiceAndSaves extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    var hitDiceIcon = getIcon('hitDice');
    var deathIcon = getIcon('deathIcon');
    
    return(
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
              deathKey={"deathsucc"}
            />
            <br/>
            {deathIcon} Failures: <DeathSavesHelper
              saves={this.props.deathSaves.failures}
              deathKey={"deathfail"}
            />
            <br/>
            Death Saves
          </Panel>
        </Col>
      </Row>
    );
  }
}

class DeathSavesHelper extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    var circle = getIcon('skill',false);
    var darkcircle = getIcon('skill',true);
    var deathSaves = [];
    var deathKey = this.props.deathKey;
    
    for (let i = 0; i < 3; i++) {
      if (i < this.props.saves){
        deathSaves.push(<text key={deathKey+i}>{darkcircle}</text>);
      } else {
        deathSaves.push(<text key={deathKey+i}>{circle}</text>);
      }
    }
    
    return (
      <text key={deathKey}>
        {deathSaves}
      </text>
    );
  }
}

export class SpellArea extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    
    return(
      <Row className="SpellArea" >
        <Col className="col" md={4}>
          <Panel className="centered">
            SpellCasting Ability: {this.props.cast}
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

AbilityScore.propTypes = {
  mod: React.PropTypes.number.isRequired,
	name: React.PropTypes.string.isRequired,
  savingThrows: React.PropTypes.object.isRequired,
  skills: React.PropTypes.object.isRequired,
  value: React.PropTypes.number.isRequired
};

export class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return;
  }
}

Header.propTypes = {
};
