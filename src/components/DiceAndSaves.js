'use strict';

// Inport libraries
import React from 'react';
import {FormGroup, FormControl, Col, Row, Panel} from 'react-bootstrap';

// Import icons
import {FaGittip, FaMedkit} from 'react-icons/lib/fa';

// Displays a character's hit dice and death saves in the Character Sheet View
export class DiceAndSaves extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    //editing needs
    var charHitDice = this.props.hitDice;
    var deathSucc = this.props.deathSaves.successes;
    var deathFails = this.props.deathSaves.failures;
    if (this.props.viewState === 1) {
      charHitDice = (
        <FormGroup>
          <FormControl id="csform-hitDice" type="text" defaultValue={charHitDice}/>
        </FormGroup>
      );
      deathSucc = (
        <FormGroup>
          <FormControl id="csform-deathSucc" type="number" defaultValue={deathSucc}/>
        </FormGroup>
      );
      deathFails = (
        <FormGroup>
          <FormControl id="csform-deathFails" type="number" defaultValue={deathFails}/>
        </FormGroup>
      );
    }

    return (
      <Row className="DiceAndSaves" >
        <Col className="col" md={4}>
          <Panel header="Hit Dice" className="centered">
            <FaGittip />
            {charHitDice}
          </Panel>
        </Col>
        <Col className="col" md={8}>
          <Panel header="Death Saves" className="centered">
            <FaMedkit /> {'Successes: '} {deathSucc}
            <br/>
            <FaMedkit /> {'Failures: '} {deathFails}
          </Panel>
        </Col>
      </Row>
    );
  }
}

DiceAndSaves.propTypes = {
  deathSaves: React.PropTypes.object.isRequired,
  hitDice: React.PropTypes.string.isRequired,
  viewState: React.PropTypes.number.isRequired
};

export default DiceAndSaves;
