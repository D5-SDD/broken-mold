'use strict';

// Inport libraries
import React from 'react';
import {Button, InputGroup, FormGroup, FormControl, Row, Col, Panel} from 'react-bootstrap';
import {CLASSES_DB} from '../../lib/Character';

// Import icons
import {FaMinusSquare, FaPlusSquare} from 'react-icons/lib/fa';

// Displays various character information in the Header for the Character Sheet View
class Header extends React.Component {
  constructor(props) {
    super(props);

    this.classAndLevelOptions = [];
    for (let i = 0; i < CLASSES_DB.length; i++) {
      let val = CLASSES_DB[i];
      this.classAndLevelOptions.push(
        <option value={val} key={i}>
          {val}
        </option>
      );
    }

    this.classes = this.props.classes;
    this.state = {
      classes: this.props.classes
    };
    this.resetState = false;

    this.addClassAndLevel = this.addClassAndLevel.bind(this);
    this.removeClassAndLevel = this.removeClassAndLevel.bind(this);
  }

  addClassAndLevel(e) {
    var input = $(e.currentTarget).parent().siblings();
    var classLevelToAdd = {
        name: input[0].value,
        level: input[1].value
    };
    this.state.classes.push(classLevelToAdd);
    this.setState({
      classes: this.state.classes
    });
  }

  removeClassAndLevel(e) {
    var input = $(e.currentTarget).parent().siblings();
    var classLevelToRemove = {
      name: input[0].value,
      level: input[1].value
    };
    var index = -1;
    for (let i = 0; i < this.state.classes.length; i++) {
      console.log(this.state.classes[i]);
      console.log(classLevelToRemove);
      if (this.state.classes[i] === classLevelToRemove) {
        index = i;
        break;
      }
    }

    if (index < 0) {
      return;
    }

    this.state.classes.splice(index, 1);
    this.setState({
      classes: this.state.classes
    });
  }

  componentWillUpdate() {
    if (this.resetState === true) {
      this.resetState = false;
      this.setState({
        classes: this.props.classes
      });
    }
  }

  render() {
    var printAlignment = this.props.alignment[0] + ' ' + this.props.alignment[1];

    if (this.props.confirmed === false) {
      if (this.props.viewState === 0) {
        this.classes = this.props.classes;
        this.resetState = true;
      }
    }
    var classes = this.classes;

    var classAndLevel = [];
    for (let i = 0; i < classes.length; i++) {
      if (this.props.viewState === 1) {
        classAndLevel.push(
          <FormGroup key={i}>
            <InputGroup>
              <InputGroup.Button>
                <Button
                  id={'remove-class-and-level'}
                  onClick={this.removeClassAndLevel}
                >
                  <FaMinusSquare/>
                </Button>
              </InputGroup.Button>
              <FormControl componentClass="select" defaultValue={classes[i].name}>
                {this.classAndLevelOptions}
              </FormControl>
              <FormControl type="number" defaultValue={classes[i].level}/>
            </InputGroup>
          </FormGroup>
        );
      } else {
        classAndLevel.push(
          <div key={i}>
            {classes[i].name + ' ' + classes[i].level}
          </div>
        );
      }
    }

    var raceOptions = [];
    for (let i = 0; i < this.props.racedb.length; i++) {
      let val = this.props.racedb[i];
      raceOptions.push(
        <option value={val} key={i}>
          {val}
        </option>
      );
    }

    var backgroundOptions = [];
    for (let i = 0; i < this.props.backgrounddb.length; i++) {
      let val = this.props.backgrounddb[i];
      backgroundOptions.push(
        <option value={val} key={i}>
          {val}
        </option>
      );
    }
    //editing needs
    var charName = this.props.name;
    var charBackground = this.props.background;
    var charPlayerName = this.props.playerName;
    var charRace = this.props.race;
    var charExp = this.props.experience;
    if (this.props.viewState === 1) {

      classAndLevel.push(
        <FormGroup key={classAndLevel.length + 1}>
          <InputGroup>
            <InputGroup.Button>
              <Button
                id={'new-class-and-level'}
                onClick={this.addClassAndLevel}
              >
                <FaPlusSquare/>
              </Button>
            </InputGroup.Button>
            <FormControl componentClass="select">
              {this.classAndLevelOptions}
            </FormControl>
            <FormControl type="number" defaultValue={0} />
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
          <FormControl id="csform-background" componentClass="select" defaultValue={charBackground}>
            {backgroundOptions}
          </FormControl>
        </FormGroup>
      );
      charPlayerName = (
        <FormGroup>
          <FormControl id="csform-player" type="text" defaultValue={charPlayerName}/>
        </FormGroup>
      );
      charRace = (
        <FormGroup>
          <FormControl id="csform-race" componentClass="select" defaultValue={charRace}>
            {raceOptions}
          </FormControl>
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
  confirmed: React.PropTypes.bool,
  experience: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  playerName: React.PropTypes.string.isRequired,
  race: React.PropTypes.string.isRequired,
  racedb: React.PropTypes.array.isRequired,
  backgrounddb: React.PropTypes.array.isRequired,
  viewState: React.PropTypes.number.isRequired
};

export default Header;
