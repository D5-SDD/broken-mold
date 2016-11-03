'use strict';

// Inport libraries
import React from 'react';
import {Panel, ListGroup, ListGroupItem} from 'react-bootstrap';
import _ from 'lodash';
import capital from 'to-capital-case';

// Displays a character's equipment in the Character Sheet View
class Equipment extends React.Component {
  constructor(props) {
    super(props);

    this.data = _.flattenDeep(this.props.data);
  }

  render() {
    var items = [];
    this.data.map(function(value) {
      let title = '';
      if (value.name) {
        title = capital(value.name);
      } else if (value.item) {
        title = capital(value.item);
      }

      items.push(
        <ListGroupItem key={items.length}>
          {title}
        </ListGroupItem>
      );
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
