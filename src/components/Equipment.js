'use strict';

// Inport libraries
import React from 'react';
import {
  InputGroup, Button, FormGroup, FormControl,
  Panel, ListGroup, ListGroupItem
} from 'react-bootstrap';

// Import icons
import {FaMinusSquare, FaPlusSquare} from 'react-icons/lib/fa';

// Import internal libraries
import {ITEMS_DB, WEAPONS_DB, ARMOR_DB} from '../../lib/Character';

// Displays a character's equipment in the Character Sheet View
class Equipment extends React.Component {
  constructor(props) {
    super(props);

    this.data = this.props.data;
    this.state = {
      data: this.props.data
    };
    this.resetState = false;

    this.db = [];
    // Get correct database
    if (this.props.heading === 'Equipment') {
      this.db = ITEMS_DB;
    } else if (this.props.heading === 'Armor') {
      this.db = ARMOR_DB;
    } else if (this.props.heading === 'Weapons') {
      this.db = WEAPONS_DB;
    }

    this.addEquipment = this.addEquipment.bind(this);
    this.removeEquipment = this.removeEquipment.bind(this);
  }

  // Adds equipment ot the list of equipment
  addEquipment(e) {
    var icon = $(e.currentTarget);
    var equipmentToAdd = icon.parent().siblings()[0].value;
    this.state.data.push(equipmentToAdd);
    this.setState({
      data: this.state.data
    });
  }

  // Removes an item from the list
  removeEquipment(e) {
    var icon = $(e.currentTarget);
    var equipmentToRemove = icon.siblings()[0].childNodes[0].textContent;
    var index = -1;
    for (let i = 0; i < this.state.data.length; i++) {
      let val = this.state.data[i];

      if (equipmentToRemove === val) {
        index = i;
        break;
      }
    }

    if (index < 0) {
      return;
    }

    this.state.data.splice(index, 1);
    this.setState({
      data: this.state.data
    });
  }

  componentWillUpdate() {
    if (this.resetState === true) {
      this.resetState = false;
      this.setState({
        data: this.props.data
      });
    }
  }

  render() {
    var items = [];

    if (this.props.confirmed === false) {
      if (this.props.viewState === 0) {
        this.data = this.props.data;
        this.resetState = true;
      }
    }
    var data = this.data;

    // Populate list based on if you are editing
    for (let i = 0; i < data.length; i++) {
      let value = data[i];

      if (this.props.viewState === 1) {
        let id = 'equipment-' + this.props.heading;
        value = (
          <span>
            <FaMinusSquare
              className="minus"
              id={'minus-' + id + '-' + i}
              onClick={this.removeEquipment}
            />
            <span className={id}>{value}</span>
          </span>
        );
      }

      items.push(
        <ListGroupItem key={items.length}>
          {value}
        </ListGroupItem>
      );
    }

    // Add button for adding equipment if editing
    var form = null;
    if (this.props.viewState === 1) {
      var options = [];

      for (let i = 0; i < this.db.length; i++) {
        var val = this.db[i].name;
        options.push(
          <option value={val} key={i}>
            {val}
          </option>
        );
      }

      form = (
        <FormGroup>
          <InputGroup>
            <InputGroup.Button>
              <Button
                id={'new-' + this.props.heading}
                onClick={this.addEquipment}
              >
                <FaPlusSquare/>
              </Button>
            </InputGroup.Button>
            <FormControl componentClass="select" placeholder="">
              {options}
            </FormControl>
          </InputGroup>
        </FormGroup>
      );
    }

    var list = null;
    if (items.length > 0) {
      list = (
        <ListGroup fill>
          {items}
        </ListGroup>
      );
    }

    return (
      <Panel header={this.props.heading}>
        {list}
        {form}
      </Panel>
    );
  }
}

Equipment.propTypes = {
  confirmed: React.PropTypes.bool,
  data: React.PropTypes.array.isRequired,
  heading: React.PropTypes.string.isRequired,
  viewState: React.PropTypes.number.isRequired
};

export default Equipment;
