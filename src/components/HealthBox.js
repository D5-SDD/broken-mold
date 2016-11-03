/*
  What does this class do?
*/

'use strict';

// Inport libraries
import React from 'react';
import {Col, Row, Panel} from 'react-bootstrap';

// Import icons
import {FaHeart, FaHeartbeat, FaHeartO} from 'react-icons/lib/fa';

class HealthBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    var heartIcon = <FaHeartO />;
    var healthIcon = <FaHeart />;
    var tempIcon = <FaHeartbeat />;

    return (
      <Row className="healthBox" >
        <Col className="col" md={12}>
          <Col className="col" md={4}>
            <Panel header="Max Health" className="centered">
              {healthIcon} {this.props.health.maximum}
            </Panel>
          </Col>
          <Col className="col" md={4}>
            <Panel header="Curr Health" className="centered">
              {heartIcon} {this.props.health.current}
            </Panel>
          </Col>
          <Col className="col" md={4}>
            <Panel header="Temp Health" className="centered">
              {tempIcon} {this.props.health.temporary}
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
