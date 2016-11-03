'use strict';

// Inport libraries
import React from 'react';
import {Panel, ListGroup, ListGroupItem} from 'react-bootstrap';
import capital from 'to-capital-case';

// Displays a character's equipment in the Character Sheet View
class Equipment extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var items = [];

    // flatten the array of types of equipment to a list
    this.props.data.map(function(value) {
      value.map(function(value) {
        items.push(
          <ListGroupItem key={items.length}>
            {capital(value.name)}
          </ListGroupItem>
        );
      });
    });

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
};

export default Equipment;
