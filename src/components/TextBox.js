/*
  What does this class do?
*/

'use strict';

// Import libraries
import React from 'react';
import {Accordion, Col, Row, Panel} from 'react-bootstrap';
import capital from 'to-capital-case';
import _ from 'lodash';

class TextBox extends React.Component {
  constructor(props) {
    super(props);

    this.id = this.props.title;
    this.header = capital(this.id);
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

export default TextBox;
