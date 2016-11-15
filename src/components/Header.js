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
    var printAlignment = this.props.alignment[0] + ' ' + this.props.alignment[1];
    var classAndLevel = [];
    for (let i=0; i<this.props.classes.length; i++) {
      classAndLevel.push(
        <div>
          {this.props.classes[i].name+ ' ' +this.props.classes[i].level}
        </div>
       );
    }
    
    return (
      <Row className="header" >
        <Col className="col" md={3}>
          <Panel className="centered">
            Character Name: {this.props.name}
          </Panel>
        </Col>
        <Col className="col" md={9}>
          <Row>
            <Col className="col" md={3}>
              <Panel className="centered">
                Class & Level:<br/> {classAndLevel}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel className="centered">
                Background:<br/> {this.props.background}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel className="centered">
                Player Name:<br/> {this.props.playerName}
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col className="col" md={3}>
              <Panel className="centered">
                Race:<br/> {this.props.race}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel className="centered">
                Alignment:<br/> {printAlignment}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel className="centered">
                Experience Points:<br/> {this.props.experience}
              </Panel>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

Header.propTypes = {
  alignment: React.PropTypes.array.isRequired,
  background: React.PropTypes.string.isRequired,
  experience: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  playerName: React.PropTypes.string.isRequired,
  race: React.PropTypes.string.isRequired
};

export default Header;
