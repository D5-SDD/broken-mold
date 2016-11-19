'use strict';

// Inport libraries
import React from 'react';
import {Grid, Col, Row, Panel} from 'react-bootstrap';
import {TextBox} from '../components/CharacterSheet';

// Displays a character's spell information in the Character Sheet View
class SpellArea extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    return (
      <Row className="SpellArea">
        <Col className="col" md={4}>
          <Panel header="Spell-Casting Ability" className="centered">
            {this.props.cast}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <Panel header="Spell Save DC" className="centered">
            {this.props.save}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <Panel header="Spell Attack Bonus" className="centered">
            {this.props.attack}
          </Panel>
        </Col>
      </Row>
    );
  }
}

SpellArea.propTypes = {
  attack: React.PropTypes.number.isRequired,
  cast: React.PropTypes.string.isRequired,
  save: React.PropTypes.number.isRequired,
};

export default SpellArea;
