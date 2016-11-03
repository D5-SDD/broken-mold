'use strict';

import AbilityScores from './AbilityScores';
import CombatStatistics from './CombatStatistics';
import Currency from './Currency';
import DiceAndSaves from './DiceAndSaves';
import Equipment from './Equipment';
import Header from './Header';
import HealthBox from './HealthBox';
import SpellArea from './SpellArea';
import TextBox from './TextBox';

// Import the stylesheet for all the components
import '../stylesheets/components/CharacterSheet';

<<<<<<< HEAD
function capitalize(s) {
  s = s.replace(/([A-Z])/g, ' $1');
  s = s.charAt(0).toUpperCase() + s.slice(1);
  s = s.replace(/\b\w+/g, function(s) {
    return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
  });
  return s;
}

export class AbilityScore extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    var name = this.props.name;
    var savingThrowsIcon = <FaStarO />;
    if (this.props.savingThrows.proficient === true) {
      savingThrowsIcon = <FaStar />;
    }

    var skills = [];
    for (let i = 0; i < SKILLS[name].length; i++) {
      let skill = SKILLS[name][i];
      let icon = <FaCircleO />;
      if (this.props.skills[skill].proficient === true) {
        icon = <FaCircle />;
      }

      let skillName = capitalize(skill);
      skills.push(<div key={skill}>{icon} {this.props.skills[skill].value} {skillName}</div>);
    }

		return (
      <Row className="ability-score" id={name} >
        <Col className="col" md={4}>
          <Panel header={capitalize(name)} className="centered">
            <div className='ability-score value'>
              {this.props.value}
            </div>
            <div className='ability-score mod'>
              {this.props.mod}
            </div>
          </Panel>
        </Col>
        <Col className="col" md={8}>
          <Panel>
            <span className="saving-throws">
              {savingThrowsIcon} {this.props.savingThrows.value} Saving Throws
            </span>
            <div className="skills">
              {skills}
            </div>
          </Panel>
        </Col>
      </Row>
		);
	}
}

AbilityScore.propTypes = {
  mod: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  savingThrows: React.PropTypes.object.isRequired,
  skills: React.PropTypes.object.isRequired,
  value: React.PropTypes.number.isRequired
};

export class HealthBox extends React.Component {
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
          <Panel>
            <Col className="col" md={4}>
              <Panel className="centered">
                {healthIcon} Max Health: {this.props.health.maximum}
              </Panel>
            </Col>
            <Col className="col" md={4}>
              <Panel className="centered">
                {heartIcon} Current Health: {this.props.health.current}
              </Panel>
            </Col>
            <Col className="col" md={4}>
              <Panel className="centered">
                {tempIcon} Temp Health: {this.props.health.temporary}
              </Panel>
            </Col>
          </Panel>
        </Col>
      </Row>
    );
	}
}

HealthBox.propTypes = {
  health: React.PropTypes.object.isRequired
};

export class DiceAndSaves extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    var hitDiceIcon = <FaGittip />;
    var deathIcon = <FaMedkit />;

    return (
      <Row className="DiceAndSaves" >
        <Col className="col" md={4}>
          <Panel className="centered">
            {hitDiceIcon} Hit Dice: {this.props.hitDice}
          </Panel>
        </Col>
        <Col className="col" md={8}>
          <Panel className="centered">
            {deathIcon} Successes: <DeathSavesHelper
              saves={this.props.deathSaves.successes}
              deathKey="deathsucc"
            />
            <br/>
            {deathIcon} Failures: <DeathSavesHelper
              saves={this.props.deathSaves.failures}
              deathKey="deathfail"
            />
            <br/>
            Death Saves
          </Panel>
        </Col>
      </Row>
    );
  }
}

DiceAndSaves.propTypes = {
  deathSaves: React.PropTypes.object.isRequired,
  hitDice: React.PropTypes.string.isRequired
};

class DeathSavesHelper extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    var deathSaves = [];
    var deathKey = this.props.deathKey;

    for (let i = 0; i < 3; i++) {
      if (i < this.props.saves){
        deathSaves.push(<text key={deathKey+i}><FaCircle /></text>);
      } else {
        deathSaves.push(<text key={deathKey+i}><FaCircleO /></text>);
      }
    }

    return (
      <text key={deathKey}>
        {deathSaves}
      </text>
    );
  }
}

DeathSavesHelper.propTypes = {
  deathKey: React.PropTypes.string.isRequired,
  saves: React.PropTypes.number.isRequired
};

export class SpellArea extends React.Component {
  constructor(props) {
		super(props);
	}

	render() {
    return (
      <Row className="SpellArea">
        <Col className="col" md={4}>
          <Panel className="centered">
            Spell-Casting Ability: {this.props.cast}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <Panel className="centered">
            Spell Save DC: {this.props.save}
          </Panel>
        </Col>
        <Col className="col" md={4}>
          <Panel className="centered">
            Spell Attack Bonus: {this.props.attack}
          </Panel>
        </Col>
      </Row>
    );
  }
}

SpellArea.propTypes = {
  cast: React.PropTypes.string.isRequired,
  attack: React.PropTypes.number.isRequired,
  save: React.PropTypes.number.isRequired
};

export class TextBox extends React.Component {
  constructor(props) {
    super(props);

    this.id = this.props.title;
    this.header = capitalize(this.id);
    this.data = [this.props.data];

    if (typeof this.props.data === 'object') {
      this.data = _.map(this.props.data, function(obj) {
        if (typeof obj === 'string') {
          return obj;
        }
        return _.values(obj);
      });
      this.data = _.flatten(this.data);
    }
  }

  render() {
    var data = [];
    for (let i = 0; i < this.data.length; i++) {
      if (this.props.accordion === true) {
        data.push(
          <Panel header={this.data[i]} eventKey={i/2} key={i/2}>
            {this.data[i+1]}
          </Panel>
        );
        i++;
      } else {
        data.push(<div key={i}>{this.data[i]}</div>);
      }
    }

    if (this.props.accordion === true) {
      return (
        <Row>
          <Col md={11}>
            <Panel id={this.id} header={this.header}>
              <Accordion>
                {data}
              </Accordion>
            </Panel>
          </Col>
        </Row>
      );
    }
    return (
      <Panel id={this.id} header={this.header}>
        {data}
      </Panel>
    );
  }
}

TextBox.propTypes = {
  accordion: React.PropTypes.bool,
  data: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string
  ]).isRequired,
  title: React.PropTypes.string.isRequired
};

export class Currency extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var currencies = [];
    _.forIn(this.props.currency, function(value, key){
      currencies.push(
        <tr key={key}>
          <td>{capitalize(key)}</td>
          <td>{value}</td>
        </tr>
      );
    });

    return (
      <Panel header="Currency">
        <Table fill bordered>
          <tbody>
            {currencies}
          </tbody>
        </Table>
      </Panel>
    );
  }
}

Currency.propTypes = {
  currency: React.PropTypes.shape({
    platinum: React.PropTypes.number,
    gold: React.PropTypes.number,
    electrum: React.PropTypes.number,
    silver: React.PropTypes.number,
    copper: React.PropTypes.number
  }).isRequired
};

export class Equipment extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var items = [];
    this.props.data.map(function(value) {
      value.map(function(value) {
        items.push(
          <ListGroupItem key={items.length}>
            {capitalize(value.name)}
          </ListGroupItem>
        );
      })
    })

    return (
      <Panel header="Equipment">
        <ListGroup fill>
          {items}
        </ListGroup>
      </Panel>
    );
  }
}

Equipment.propTypes = {
  data: React.PropTypes.array.isRequired
}

export class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    var printAlignment = this.props.alignment[0]+" "+this.props.alignment[1];
    var classesLevels = this.props.classes[0].name +" | "+this.props.classes[0].level+"\n";
    
    return (
      <Row className="Header" >
        <Col className="col" md={3}>
          <Panel className="centered">
            Character Name: {this.props.name}
          </Panel>
        </Col>
        <Col className="col" md={9}>
          <Row>
            <Col className="col" md={3}>
              <Panel className="centered">
                Class & Level:<br/> {this.classLevels}
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
  name: React.PropTypes.string.isRequired,
  playerName: React.PropTypes.string.isRequired,
  classes: React.PropTypes.array.isRequired,
  race: React.PropTypes.string.isRequired,
  alignment: React.PropTypes.array.isRequired,
  experience: React.PropTypes.number.isRequired,
  background: React.PropTypes.string.isRequired
};


export class Armor_Initiative_Speed extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return(
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

Armor_Initiative_Speed.propTypes = {
  armorClass: React.PropTypes.string.isRequired,
  initiative: React.PropTypes.number.isRequired,
  speed: React.PropTypes.number.isRequired
=======
// package together all the components that are included in the Character Sheet View
export {
  AbilityScores,
  CombatStatistics,
  Currency,
  DiceAndSaves,
  Equipment,
  Header,
  HealthBox,
  SpellArea,
  TextBox
>>>>>>> 354551362c3aee585b28f91706fadf26a5ad391f
};
