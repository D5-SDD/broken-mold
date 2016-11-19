'use strict';

// Inport libraries
import React from 'react';
import {FormGroup, FormControl, Panel, ListGroup, ListGroupItem} from 'react-bootstrap';
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
    var EquipViewState = this.props.viewState;
    
    this.data.map(function(value) {
      let title = '';
      if (value.name) {
        title = capital(value.name);
      } else if (value.item) {
        title = capital(value.item);
      }

      items.push(
        /* if (EquipViewState === 1) {
          <FormGroup key={items.length}>
            <FormControl id={"csform-item-"+items.length} type="text" 
              defaultValue={title}/>
          </FormGroup>
        } else { */
          <ListGroupItem key={items.length}>
            {title}
          </ListGroupItem>
        //}
      );
    });

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
