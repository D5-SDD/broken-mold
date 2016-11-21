'use strict';

// Inport libraries
import React from 'react';
import {FormGroup, FormControl, Grid, Col, Row, Panel} from 'react-bootstrap';
import {TextBox} from '../components/CharacterSheet';

// Displays a character's spell information in the Character Sheet View
class SpellArea extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    var spellClass = this.props.cast;
    var options = [];
    for (let i = 0; i < this.props.db.length; i++) {
      var val = this.props.db[i];
      options.push(
          <option value={val} key={i}>
            {val}
          </option>
      );
    }
    if (this.props.viewState) {
      spellClass = (
        <FormGroup>
          <FormControl id='csform-spellclass' componentClass="select" defaultValue={this.props.cast}>
            {options}
          </FormControl>
        </FormGroup>
      );
    }
    return (
      <Row className="SpellArea">
        <Col className="col" md={5}>
          <Panel header="Spell-Casting Class" className="centered">
            {spellClass}
          </Panel>
        </Col>
        <Col className="col" md={3}>
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
  db: React.PropTypes.array.isRequired
};

export default SpellArea;
