/*
  What does this class do?
*/

'use strict';

// Inport libraries
import React from 'react';
import {Panel, ListGroup, ListGroupItem} from 'react-bootstrap';
import capital from 'to-capital-case';

class Equipment extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    var items = [];
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
