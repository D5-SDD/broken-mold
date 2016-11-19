'use strict';

// Inport libraries
import React from 'react';
import {Button, InputGroup, FormGroup, FormControl, Row, Col, Panel} from 'react-bootstrap';

// Import icons
import {FaMinusSquare, FaPlusSquare} from 'react-icons/lib/fa';

// Displays various character information in the Header for the Character Sheet View
class Header extends React.Component {
  constructor(props) {
    super(props);

    this.addClassAndLevel = this.addClassAndLevel.bind(this);
  }

  addClassAndLevel(e) {
    var icon = $('#'+e.currentTarget.id);
    var equipmentToAdd = icon.parent().siblings()[0].value;

  }

  render() {
    var printAlignment = this.props.alignment[0] + ' ' + this.props.alignment[1];
    var classAndLevel = [];
    for (let i=0; i<this.props.classes.length; i++) {
      if (this.props.viewState === 1) {
        classAndLevel.push(
          <FormGroup key={i}>
            <FormControl id={'csform-class-'+i} type="text"
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
      classAndLevel.push(
        <FormGroup>
          <InputGroup>
            <InputGroup.Button>
              <Button
                id={'new-class-and-level'}
                onClick={this.addClassAndLevel}
              >
                <FaPlusSquare/>
              </Button>
            </InputGroup.Button>
            <FormControl id="csform-name" type="text"/>
          </InputGroup>
        </FormGroup>
      );
      charName = (
        <FormGroup>
          <FormControl id="csform-name" type="text" defaultValue={this.props.name}/>
        </FormGroup>
      );
      charBackground = (
        <FormGroup>
          <FormControl id="csform-background" type="text" defaultValue={charBackground}/>
        </FormGroup>
      );
      charPlayerName = (
        <FormGroup>
          <FormControl id="csform-player" type="text" defaultValue={charPlayerName}/>
        </FormGroup>
      );
      charRace = (
        <FormGroup>
          <FormControl id="csform-race" type="text" defaultValue={charRace}/>
        </FormGroup>
      );
      printAlignment = (
        <FormGroup>
          <FormControl id="csform-alignment" type="text"
            defaultValue={this.props.alignment[0] + ' ' + this.props.alignment[1]}/>
        </FormGroup>
      );
      charExp = (
        <FormGroup>
          <FormControl id="csform-experience" type="number" defaultValue={charExp}/>
        </FormGroup>
      );
    }

    return (
      <Row className="header" >
        <Col className="col" md={3}>
          <Panel header="Character Name" className="centered">
            {charName}
          </Panel>
        </Col>
        <Col className="col" md={9}>
          <Row>
            <Col className="col" md={3}>
              <Panel header="Class & Level" className="centered">
                {classAndLevel}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel header="Background" className="centered">
                {charBackground}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel header="Player Name" className="centered">
                {charPlayerName}
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col className="col" md={3}>
              <Panel header="Race" className="centered">
                {charRace}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel header="Alignment" className="centered">
                {printAlignment}
              </Panel>
            </Col>
            <Col className="col" md={3}>
              <Panel header="Experience Points" className="centered">
                {charExp}
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
  classes: React.PropTypes.array.isRequired,
  experience: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  playerName: React.PropTypes.string.isRequired,
  race: React.PropTypes.string.isRequired,
  viewState: React.PropTypes.number.isRequired
};

export default Header;
