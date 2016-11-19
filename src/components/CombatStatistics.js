'use strict';

// Import libraries
import React from 'react';
import {FormGroup, FormControl, Row, Col, Panel} from 'react-bootstrap';

// Displays armor class, initiative, and speed information in
// the Header for the Character Sheet View
class CombatStatistics extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var speed = this.props.speed;
    
    if(this.props.viewState) {
      speed = (
        <FormGroup>
          <FormControl id="csform-speed" type="number" defaultValue={speed} />
        </FormGroup>
      );
    }
  
    return (
      <Row className="Armor_Initiative_Speed" >
        <Col className="col" md={4}>
          <Panel header="Armor Class" className="centered">
            {this.props.armorClass}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <Panel header="Initiative" className="centered">
            {this.props.initiative}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <Panel header="Speed" className="centered">
            {speed}
          </Panel>
        </Col>
      </Row>
    );
  }
}

CombatStatistics.propTypes = {
  armorClass: React.PropTypes.number.isRequired,
  initiative: React.PropTypes.number.isRequired,
  speed: React.PropTypes.number.isRequired
};

export default CombatStatistics;
