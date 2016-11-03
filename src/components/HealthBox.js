'use strict';

// Inport libraries
import React from 'react';
import {Col, Row, Panel} from 'react-bootstrap';

// Import icons
import {FaHeart, FaHeartbeat, FaHeartO} from 'react-icons/lib/fa';

// Displays a character's health information in the Character Sheet View
class HealthBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    return (
      <Row className="healthBox" >
        <Col className="col" md={12}>
          <Col className="col" md={4}>
            <Panel header="Max Health" className="centered">
              <FaHeart /> {this.props.health.maximum}
            </Panel>
          </Col>
          <Col className="col" md={4}>
            <Panel header="Curr Health" className="centered">
              <FaHeartO /> {this.props.health.current}
            </Panel>
          </Col>
          <Col className="col" md={4}>
            <Panel header="Temp Health" className="centered">
              <FaHeartbeat /> {this.props.health.temporary}
            </Panel>
          </Col>
        </Col>
      </Row>
    );
	}
}

HealthBox.propTypes = {
  health: React.PropTypes.object.isRequired
};

export default HealthBox;
