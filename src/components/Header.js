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
    var printAlignment = this.props.alignment[0] + ' ' + this.props.alignment[1];
    var classAndLevel = [];
    for (let i=0; i<this.props.classes.length; i++) {
      if (this.props.viewState === 1) {
        classAndLevel.push(
          //may need help here, fact that its an array is making update weird
          <FormGroup key={i}>
            <FormControl id={"csform-class-"+i} type="text" 
            defaultValue={this.props.classes[i].name+ ' ' +this.props.classes[i].level}/>
          </FormGroup>
        );
      } else {
        classAndLevel.push(
          <div key={i}>
            {this.props.classes[i].name+ ' ' +this.props.classes[i].level}
          </div>
        );
      }
    }
    

    //editing needs
    var charName = this.props.name;
    var charBackground = this.props.background;
    var charPlayerName = this.props.playerName;
    var charRace = this.props.race;
    var charExp = this.props.experience;
    if (this.props.viewState === 1) {
      charName = (
        <FormGroup>
          <FormControl id="csform-name" type="text" defaultValue={this.props.name}/>
        </FormGroup>
      )
      charBackground = (
        <FormGroup>
          <FormControl id="csform-background" type="text" defaultValue={charBackground}/>
        </FormGroup>
      )
      charPlayerName = (
        <FormGroup>
          <FormControl id="csform-Player" type="text" defaultValue={charPlayerName}/>
        </FormGroup>
      )
      charRace = (
        <FormGroup>
          <FormControl id="csform-race" type="text" defaultValue={charRace}/>
        </FormGroup>
      )
      printAlignment = (
        <FormGroup>
          <FormControl id="csform-alignment" type="text"
            defaultValue={this.props.alignment[0] + ' ' + this.props.alignment[1]}/>
        </FormGroup>
      )
      charExp = (
        <FormGroup>
          <FormControl id="csform-experience" type="number" defaultValue={charExp}/>
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
                Class & Level:<br/> {classAndLevel}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel className="centered">
                Background:<br/> {charBackground}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel className="centered">
                Player Name:<br/> {charPlayerName}
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col className="col" md={3}>
              <Panel className="centered">
                Race:<br/> {charRace}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel className="centered">
                Alignment:<br/> {printAlignment}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel className="centered">
                Experience Points:<br/> {charExp}
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
