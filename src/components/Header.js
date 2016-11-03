'use strict';

// Inport libraries
import React from 'react';
import {Row, Col, Panel} from 'react-bootstrap';

// Displays various character information in the Header for the Character Sheet View
class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row className="header">
        <Col className="col" md={4}>
          <Panel className="centered">
            Character Name: {this.props.name}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <div>
            TODO
          </div>
        </Col>
      </Row>
    );
  }
}

Header.propTypes = {
  name: React.PropTypes.string.isRequired
};

export default Header;
