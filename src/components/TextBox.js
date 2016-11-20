'use strict';

// Import libraries
import React from 'react';
import {
  FormGroup, FormControl, Accordion, Col, Row, Panel,
  ListGroup, ListGroupItem, InputGroup, Button
} from 'react-bootstrap';
import capital from 'to-capital-case';
import {FaMinusSquare, FaPlusSquare} from 'react-icons/lib/fa';
import _ from 'lodash';

// Generix display for text and lists of properties in the Character Sheet View
class TextBox extends React.Component {
  constructor(props) {
    super(props);

    this.id = this.props.title;
    this.header = capital(this.id);
    this.data = [this.props.data];
    this.state = {
      data: this.props.data
    };

    // if the data needs to be parsed, flatten it to the information we want to display
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

    // populate the data to display based on the type of information being displayed
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
    var items = [];
    for (let i = 0; i < data.length; i++) {
      let value = data[i].props.header;
      
      if (this.props.viewState) {
        let id = 'spells';
        value = (
          <span>
            <FaMinusSquare className="minus" id={'minus-' + id + '-' + i} onClick={() => {console.log('test');}}/>
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
    
    var list = null;
    if (items.length > 0) {
      list = (
        <ListGroup fill>
          {items}
        </ListGroup>
      );
    }
    
    var accordionRender = (
      <Accordion>
        {data}
      </Accordion>
    )
    if (this.props.viewState) {
      accordionRender = (list);
    }
    
    var form = null;
    if (this.props.viewState) {
      var options = [];
      if (this.props.db) {
        for (let i = 0; i < this.props.db.length; i++) {
          let val = this.props.db[i].name;
          options.push(
            <option value={val} key={i}>
              {val}
            </option>
          );
        }
      }
      
      form = (
        <FormGroup>
          <InputGroup>
            <InputGroup.Button>
              <Button
                id={'new-spell'}
                onClick={() => {console.log('test 2');}}
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
    // render an accordion if necessary
    if (this.props.accordion === true) {
      return (
        <Row>
          <Col md={11}>
            <Panel id={this.id} header={this.header}>
              {accordionRender}
              {form}
            </Panel>
          </Col>
        </Row>
      );
    }

    if (this.props.viewState && data.length > 0) {
      data = (
        <FormGroup>
          <FormControl id={'csform-' + this.id} type="text" defaultValue={data[0].props.children} />
        </FormGroup>
      );
    }

    // otherwise just render a panel
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
  title: React.PropTypes.string.isRequired,
  db: React.PropTypes.array,
  viewState: React.PropTypes.number.isRequired
};

export default TextBox;
