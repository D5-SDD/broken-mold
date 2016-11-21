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
import {findSpell /*FEATURE_TRAITS_DB*/} from '../../lib/Character';

// Generix display for text and lists of properties in the Character Sheet View
class TextBox extends React.Component {
  constructor(props) {
    super(props);

    this.id = this.props.title;
    this.header = capital(this.id);
    this.data = [this.props.data];
    this.resetState = false;

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
    
    this.state = {
      data: this.data
    };
    
    this.addToList = this.addToList.bind(this);
    this.removeFromList = this.removeFromList.bind(this);
  }
  
  
  addToList(item) {
    var icon = $(item.currentTarget);
    var itemToAdd = icon.parent().siblings()[0].value;
    for (let i = 0; i < this.props.db.length; i++) {
      let val = this.props.db[i].name;
      if (val === itemToAdd) {
        this.state.data.push(this.props.db[i].name);
        this.state.data.push(findSpell(this.props.db[i].name).description);
        this.setState({
          data: this.state.data
        });
        break;
      }
    }
  }
  
  removeFromList (item) {
    var icon = $(item.currentTarget);
    var itemToRemove = icon.siblings()[0].childNodes[0].textContent;
    var index = -1;
    for (let i = 0; i < this.state.data.length; i++) {
      let val = this.state.data[i];
      if (itemToRemove === val) {
        index = i;
        break;
      }
    }

    if (index < 0) {
      return;
    }
    this.state.data.splice(index, 2);
    this.setState({
      data: this.state.data
    });
  }
  
  
  componentWillUpdate() {
    if (this.resetState === true) {
      this.resetState = false;
      this.setState({
        data: this.data
      });
    }
  }
  
  
  render() {
    var data = [];
    if (this.props.confirmed === false) {
      if (this.props.viewState === 0) {
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
        this.resetState = true;
      }
    }
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
        let id = this.props.title;
        value = (
          <span>
            <FaMinusSquare 
              className="minus" 
              id={'minus-' + id + '-' + i} 
              onClick={this.removeFromList}
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
                id={'new-' + this.props.title}
                onClick={this.addToList}
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
      var tempData = [];
      for (let i = 0; i < this.data.length; i++) {
        tempData.push(
          <FormGroup key={i}>
            <FormControl className={'csform-' + this.id} type="text"
              defaultValue={data[i].props.children} />
          </FormGroup>
        );
      }
      data = tempData;
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
  confirmed: React.PropTypes.bool,
  viewState: React.PropTypes.number.isRequired
};

export default TextBox;
