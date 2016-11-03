'use strict';

// Import libraries
import React from 'react';
import {Row, Col, Panel} from 'react-bootstrap';

// Displays armor class, initiative, and speed information in
// the Header for the Character Sheet View
class CombatStatistics extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row className="Armor_Initiative_Speed" >
        <Col className="col" md={4}>
          <Panel className="centered">
            Armor Class:<br/> {this.props.armorClass}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <Panel className="centered">
            Initiative:<br/> {this.props.initiative}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <Panel className="centered">
            Speed:<br/> {this.props.speed}
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
