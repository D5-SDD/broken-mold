'use strict';

// Import libraries
import React from 'react';
import {
  InputGroup, Button, FormGroup, FormControl,
  Accordion, Col, Row, Panel, ListGroup, ListGroupItem
} from 'react-bootstrap';
import capital from 'to-capital-case';
import _ from 'lodash';
import {findSpell, findFeature} from '../../lib/Character';

// Import icons
import {FaMinusSquare, FaPlusSquare} from 'react-icons/lib/fa';

// Generix display for text and lists of properties in the Character Sheet View
class TextBox extends React.Component {
  constructor(props) {
    super(props);

    this.id = this.props.title;
    this.header = capital(this.id);
    this.data = this.parseData(this.props.data);
    this.state = {
      data: this.data,
      inputValue: ''
    };
    this.resetState = false;

    this.handleChange = this.handleChange.bind(this);
    this.parseData = this.parseData.bind(this);
    this.addToList = this.addToList.bind(this);
    this.removeFromList = this.removeFromList.bind(this);
    this.addText = this.addText.bind(this);
    this.removeText = this.removeText.bind(this);
  }

  handleChange(event, i) {
    if (i < 0) {
      this.setState({
        inputValue: event.currentTarget.value
      });
    } else {
      var data = this.state.data;
      data[i] = event.currentTarget.value;
      this.setState({
        data: data
      });
    }
  }

  parseData(inputData) {
    var data = [];
    // if the data needs to be parsed, flatten it to the information we want to display
    if (typeof inputData === 'object') {
      if (inputData.length === 0) {
        return inputData;
      }
      data = _.map(inputData, function(obj) {
        if (typeof obj === 'string') {
          return obj;
        }
        return _.values(obj);
      });
      data = _.flattenDeep(data);
    }

    return data;
  }


  addToList(item) {
    var icon = $(item.currentTarget);
    var itemToAdd = icon.parent().siblings()[0].value;
    for (let i = 0; i < this.props.db.length; i++) {
      let val = this.props.db[i].name;
      if (val === itemToAdd) {
        this.state.data.push(this.props.db[i].name);
        if (this.props.title === 'Spells'){
          this.state.data.push(findSpell(this.props.db[i].name).description);
        } else if (this.props.title === 'featuresAndTraits'){
          this.state.data.push(findFeature(this.props.db[i].name).description);
        }
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

  addText(e) {
    var input = $(e.currentTarget);
    var textToAdd = input.parent().siblings()[0].value;
    this.state.data.push(textToAdd);
    this.setState({
      classes: this.state.data,
      inputValue: ''
    });
  }

  removeText(e) {
    var input = $(e.currentTarget);
    var textToRemove = input.parent().siblings()[0].value;
    var index = -1;
    for (let i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i] === textToRemove) {
        index = i;
        break;
      }
    }

    if (index < 0) {
      return;
    }

    this.state.data.splice(index, 1);
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
    if (this.props.confirmed === false) {
      if (this.props.viewState === 0) {
        this.data = this.parseData(this.props.data);
        this.resetState = true;
      }
    }
    var data = this.data;

    var displayData = [];
    // populate the data to display based on the type of information being displayed
    for (let i = 0; i < data.length; i++) {
      if (this.props.accordion === true) {
        displayData.push(
          <Panel header={data[i]} eventKey={i/2} key={i/2}>
            {data[i+1]}
          </Panel>
        );
        i++;
      } else {
        displayData.push(<div key={i}>{data[i]}</div>);
      }
    }

    var items = [];
    for (let i = 0; i < displayData.length; i++) {
      let value = displayData[i].props.header;
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
        {displayData}
      </Accordion>
    );
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

    if (this.props.viewState) {
      var tempData = [];
      if (data.length > 1 || this.props.title === 'ProficienciesAndLanguages') {
        for (let i = 0; i < data.length; i++) {
          tempData.push(
            <InputGroup key={i}>
              <InputGroup.Button>
                <Button
                  id={'remove-' + this.id + '-button'}
                  onClick={this.removeText}
                >
                  <FaMinusSquare/>
                </Button>
              </InputGroup.Button>
              <FormControl
                className={'csform-' + this.id}
                type="text"
                value={data[i]}
                onChange={(event) => {
                  this.handleChange(event, i);
                }}
              />
            </InputGroup>
          );
        }
        tempData.push(
          <InputGroup key={tempData.length}>
            <InputGroup.Button>
              <Button
                id={'new-' + this.id + '-button'}
                onClick={this.addText}
              >
                <FaPlusSquare/>
              </Button>
            </InputGroup.Button>
            <FormControl
              className={'csform-new-' + this.id}
              type="text"
              value={this.state.inputValue}
              onChange={(event) => {
                this.handleChange(event, -1);
              }}
            />
          </InputGroup>
        );
      } else if (data.length <= 1 && this.props.title === 'ProficienciesAndLanguages') {
        tempData.push(
          <InputGroup key={tempData.length}>
            <InputGroup.Button>
              <Button
                id={'new-' + this.id + '-button'}
                onClick={this.addText}
              >
                <FaPlusSquare/>
              </Button>
            </InputGroup.Button>
            <FormControl
              className={'csform-new-' + this.id}
              type="text"
              value={this.state.inputValue}
              onChange={(event) => {
                this.handleChange(event, -1);
              }}
            />
          </InputGroup>
        );
      } else {
        tempData.push(
          <FormControl
            key={0}
            className={'csform-' + this.id}
            componentClass="textarea"
            rows="5"
            value={data[0]}
            onChange={(event) => {
              this.handleChange(event, 0);
            }}
          />
        );
      }
      displayData = (
        <FormGroup>
          {tempData}
        </FormGroup>
      );
    }

    // otherwise just render a panel
    return (
      <Panel id={this.id} header={this.header}>
        {displayData}
      </Panel>
    );
  }
}

TextBox.propTypes = {
  accordion: React.PropTypes.bool,
  confirmed: React.PropTypes.bool,
  data: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string
  ]).isRequired,
  db: React.PropTypes.array,
  title: React.PropTypes.string.isRequired,
  viewState: React.PropTypes.number.isRequired
};

export default TextBox;
