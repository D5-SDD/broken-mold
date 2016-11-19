'use strict';

// Inport libraries
import React from 'react';
import {FormGroup, FormControl, Col, Row, Panel} from 'react-bootstrap';

// Import icons
import {FaHeart, FaHeartbeat, FaHeartO} from 'react-icons/lib/fa';

// Displays a character's health information in the Character Sheet View
class HealthBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    var maxHealth = this.props.health.maximum;
    var currHealth = this.props.health.current;
    var tempHealth = this.props.health.temporary;
    
  
    if (this.props.viewState) {
      maxHealth = (
        <FormGroup>
          <FormControl id="csform-maxhealth" type="number" defaultValue={maxHealth} />
        </FormGroup>
      );
      currHealth = (
        <FormGroup>
          <FormControl id="csform-currhealth" type="number" defaultValue={currHealth} />
        </FormGroup>
      );
      tempHealth = (
        <FormGroup>
          <FormControl id="csform-temphealth" type="number" defaultValue={tempHealth} />
        </FormGroup>
      );
    }
    return (
      <Row className="healthBox" >
        <Col className="col" md={12}>
          <Col className="col" md={4}>
            <Panel header="Max Health" className="centered">
              <FaHeart /> {maxHealth}
            </Panel>
          </Col>
          <Col className="col" md={4}>
            <Panel header="Curr Health" className="centered">
              <FaHeartO /> {currHealth}
            </Panel>
          </Col>
          <Col className="col" md={4}>
            <Panel header="Temp Health" className="centered">
              <FaHeartbeat /> {tempHealth}
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
