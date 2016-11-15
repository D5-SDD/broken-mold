'use strict';

// Inport libraries
import React from 'react';
import {FormGroup, FormControl, Row, Col, Panel} from 'react-bootstrap';

// Displays various character information in the Header for the Character Sheet View
class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.viewState);
    var printAlignment = this.props.alignment[0] + ' ' + this.props.alignment[1];

    var charName = this.props.name;
    if (this.props.viewState === 1) {
      charName = (
        <FormGroup>
          <FormControl id="csform-name" type="text" defaultValue={this.props.name}/>
        </FormGroup>
      )
    }

    return (
      <Row className="header" >
        <Col className="col" md={3}>
          <Panel className="centered">
            Character Name: {charName}
          </Panel>
        </Col>
        <Col className="col" md={9}>
          <Row>
            <Col className="col" md={3}>
              <Panel className="centered">
                Class & Level:<br/>
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
  race: React.PropTypes.string.isRequired,
  viewState: React.PropTypes.number.isRequired
};

export default Header;
