'use strict';

// Import libraries
import React from 'react';
import {InputGroup, Button, FormGroup, FormControl, Accordion, Col, Row, Panel} from 'react-bootstrap';
import capital from 'to-capital-case';
import _ from 'lodash';

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
      data: this.data
    };
    this.resetState = false;

    this.parseData = this.parseData.bind(this);
    this.addText = this.addText.bind(this);
    this.removeText = this.removeText.bind(this);
  }

  parseData(inputData) {
    var data = [];
    // if the data needs to be parsed, flatten it to the information we want to display
    if (typeof inputData === 'object') {
      data = _.map(inputData, function(obj) {
        if (typeof obj === 'string') {
          return obj;
        }
        return _.values(obj);
      });
      data = _.flattenDeep(data);
    }
    if (data.length > 0) {
      return data;
    }
    return [inputData];
  }

  addText(e) {
    console.log(e);
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

  removeText(e) {
    console.log(obj);
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

    // render an accordion if necessary
    if (this.props.accordion === true) {
      return (
        <Row>
          <Col md={11}>
            <Panel id={this.id} header={this.header}>
              <Accordion>
                {displayData}
              </Accordion>
            </Panel>
          </Col>
        </Row>
      );
    }

    if (this.props.viewState) {
      var tempData = [];
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
              defaultValue={data[i]}
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
          <FormControl className={'csform-new-' + this.id} type="text"/>
        </InputGroup>
      );
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
  title: React.PropTypes.string.isRequired,
  viewState: React.PropTypes.number.isRequired
};

export default TextBox;
