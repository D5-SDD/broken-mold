'use strict';

// Inport libraries
import React from 'react';
import {InputGroup, Button, FormGroup, FormControl, Panel, ListGroup, ListGroupItem} from 'react-bootstrap';
import _ from 'lodash';
import capital from 'to-capital-case';

// Import icons
import {FaMinusSquare, FaPlusSquare} from 'react-icons/lib/fa';

// Import internal libraries
import {ITEMS_DB, WEAPONS_DB, ARMOR_DB} from '../../lib/Character';

// Displays a character's equipment in the Character Sheet View
class Equipment extends React.Component {
  constructor(props) {
    super(props);

    this.data = _.flattenDeep(this.props.data);
    this.state = {
      data: _.flattenDeep(this.props.data)
    };

    this.db = [];
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

  addEquipment(e) {
    var icon = $('#'+e.currentTarget.id);
    var equipmentToAdd = icon.parent().siblings()[0].value;
    for (let i = 0; i < this.db.length; i++) {
      let val = this.db[i].name;
      if (this.props.heading !== 'Equipment') {
        val = capital(val);
      }
      if (val === equipmentToAdd) {
        this.state.data.push(this.db[i]);
        this.setState({
          data: this.state.data
        });
        break;
      }
    }
  }

  removeEquipment(e) {
    var icon = $('#'+e.currentTarget.id);
    var equipmentToRemove = icon.siblings()[0].childNodes[0].textContent;
    var index = -1;
    for (let i = 0; i < this.state.data.length; i++) {
      let val = this.state.data[i];
      if (val.name) {
        val = capital(val.name);
      } else if (val.item) {
        val = val.item;
      }

      if (equipmentToRemove === val) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      return;
    }

    this.state.data.splice(index, 1);
    this.setState({
      data: this.state.data
    });
  }

  componentWillUpdate() {
    if (this.props.viewState === 0) {
      this.data = _.flattenDeep(this.props.data);
      this.setState({
        data: _.flattenDeep(this.props.data)
      });
    }
  }

  render() {
    var items = [];
    var data = this.state.data;
    if (this.props.viewState === 0) {
      data = this.data;
    }

    for (let i = 0; i < data.length; i++) {
      let value = data[i];
      let title = '';
      if (value.name) {
        title = capital(value.name);
      } else if (value.item) {
        title = value.item;
      }

      if (this.props.viewState === 1) {
        let id = 'equipment-' + this.props.heading + ' ' + i;
        title = (
          <span>
            <FaMinusSquare className="minus" onClick={this.removeEquipment}/>
            <span id={id}>{title}</span>
          </span>
        );
      }

      items.push(
        <ListGroupItem key={items.length}>
          {title}
        </ListGroupItem>
      );
    }

    var form = null;
    if (this.props.viewState === 1) {
      var options = [];

      for (let i = 0; i < this.db.length; i++) {
        var val = this.db[i].name;
        if (this.props.heading !== 'Equipment') {
          val = capital(val);
        }
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
  data: React.PropTypes.array.isRequired,
  heading: React.PropTypes.string.isRequired,
  viewState: React.PropTypes.number.isRequired
};

export default Equipment;
