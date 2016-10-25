'use strict';

import React from 'react';
import {Row, Col, Panel} from 'react-bootstrap';

import {SKILLS} from '../../lib/Character';

const ICONS = {
  savingThrows: {
    true: 'star',
    false: 'star-o'
  }
};

function getIcon(name, data) {
  if (data !== undefined) {
    return (<i className={'fa fa-' + ICONS[name][data]} aria-hidden="true"/>);
  } else if (name !== undefined) {
    return (<i className={'fa fa-' + ICONS[name]} aria-hidden="true"/>);
  } else {
    return (<i className="fa fa-question" aria-hidden="true"/>);
  }
}

export class AbilityScores extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="ability-scores">
        <AbilityScore
          name="strength"
          savingThrows={this.props.savingThrows.strength}
          skills={this.props.skills}
          value={this.props.abilityScores.strength}
        />
      </div>
    );
  }
}

AbilityScores.propTypes = {
  abilityScores: React.PropTypes.object.isRequired,
  savingThrows: React.PropTypes.object.isRequired,
  skills: React.PropTypes.object.isRequired
};

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
      skills[skill] = this.props.skills[skill];
    }

		return (
      <Row className="ability-score" id={name} >
        <Col className="col" md={4}>
          <Panel header={name} className="centered">
            {this.props.value}
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
