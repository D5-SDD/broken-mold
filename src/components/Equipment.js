'use strict';

// Inport libraries
import React from 'react';
import {FormGroup, FormControl, Panel, ListGroup, ListGroupItem} from 'react-bootstrap';
import _ from 'lodash';
import capital from 'to-capital-case';

// Import icons
import {FaMinusSquare} from 'react-icons/lib/fa';

// Displays a character's equipment in the Character Sheet View
class Equipment extends React.Component {
  constructor(props) {
    super(props);

    this.data = _.flattenDeep(this.props.data);
    this.state = {
      data: _.flattenDeep(this.props.data)
    };

    this.removeEquipment = this.removeEquipment.bind(this);
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
        val = capital(val.item);
      }

      if (equipmentToRemove == val) {
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

  render() {
    var items = [];
    var viewState = this.props.viewState;
    var data = this.state.data;
    if (viewState === 0) {
      data = this.data;
    }

    for (let i = 0; i < data.length; i++) {
      let value = data[i];
      let title = '';
      if (value.name) {
        title = capital(value.name);
      } else if (value.item) {
        title = capital(value.item);
      }

      if (this.props.viewState === 1) {
        let id = 'equipment-' + this.props.heading + '-' + i;
        title = (
          <span>
            <FaMinusSquare className="minus" id={id} onClick={this.removeEquipment} /> <span>{title}</span>
          </span>
        );
      }

      items.push(
        <ListGroupItem key={items.length}>
          {title}
        </ListGroupItem>
      );
    }

    return (
      <Panel header={this.props.heading}>
        <ListGroup fill>
          {items}
        </ListGroup>
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
