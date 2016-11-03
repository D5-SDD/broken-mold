/*
  What does this class do?
*/

'use strict';

// Inport libraries
import React from 'react';
import {Panel, Table} from 'react-bootstrap';
import capital from 'to-capital-case';
import _ from 'lodash';

class Currency extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var currencies = [];
    _.forIn(this.props.currency, function(value, key) {
      currencies.push(
        <tr key={key}>
          <td>{capital(key)}</td>
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

export default Currency;
