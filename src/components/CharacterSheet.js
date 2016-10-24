'use strict';

import React from 'react';
import {Row, Col, Panel} from 'react-bootstrap';

export class AbilityScore extends React.Component {
	constructor(props) {
		super(props);

    console.log(this.props.scoreData);
	}

	render() {
    var name = this.props.name;
    var className = 'ability-score ' + name;
		return (
      <Row>
        <Col className="col" md={8}>
          <Panel header={name}>{this.props.scoreData.value}</Panel>
          <Panel header={name}>{this.props.scoreData.value}</Panel>
        </Col>
      </Row>
		);
	}
}

AbilityScore.propTypes = {
	name: React.PropTypes.string.isRequired,
  scoreData: React.PropTypes.object.isRequired
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