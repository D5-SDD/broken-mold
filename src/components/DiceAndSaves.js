'use strict';

// Inport libraries
import React from 'react';
import {Col, Row, Panel} from 'react-bootstrap';

// Import icons
import {FaCircle, FaCircleO, FaGittip, FaMedkit} from 'react-icons/lib/fa';

// Displays a character's hit dice and death saves in the Character Sheet View
export class DiceAndSaves extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    return (
      <Row className="DiceAndSaves" >
        <Col className="col" md={4}>
          <Panel header="Hit Dice" className="centered">
            <FaGittip />
            {this.props.hitDice}
          </Panel>
        </Col>
        <Col className="col" md={8}>
          <Panel header="Death Saves" className="centered">
            <FaMedkit /> Successes: <DeathSavesHelper
              saves={this.props.deathSaves.successes}
              deathKey="deathsucc"
            />
            <br/>
            <FaMedkit /> Failures: <DeathSavesHelper
              saves={this.props.deathSaves.failures}
              deathKey="deathfail"
            />
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

export default DiceAndSaves;

// Displays an individual row of death saves
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
