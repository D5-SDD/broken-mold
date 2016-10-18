'use strict';

import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import CharacterSheetSidebar from '../components/CharacterSheetSidebar';

import '../stylesheets/containers/CharacterSheet';

class CharacterSheet extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var CS_GRID = null;
    CS_GRID = (
      <Grid className="grid">
        <Row className="show-grid">
          <Col xs={12} md={8}>
            <code>&lt;{'Col xs={12} md={8}'} /&gt;</code>
          </Col>
          <Col xs={6} md={4}>
            <code>&lt;{'Col xs={6} md={4}'} /&gt;</code>
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={6} md={4}>
            <code>&lt;{'Col xs={6} md={4}'} /&gt;</code>
          </Col>
          <Col xs={6} md={4}>
            <code>&lt;{'Col xs={6} md={4}'} /&gt;</code>
          </Col>
          <Col xsHidden md={4}>
            <code>&lt;{'Col xsHidden md={4}'} /&gt;</code>
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={6} xsOffset={6}>
            <code>&lt;{'Col xs={6} xsOffset={6}'} /&gt;</code>
          </Col>
        </Row>

        <Row className="show-grid">
          <Col md={6} mdPush={6}>
            <code>&lt;{'Col md={6} mdPush={6}'} /&gt;</code>
          </Col>
          <Col md={6} mdPull={6}>
            <code>&lt;{'Col md={6} mdPull={6}'} /&gt;</code>
          </Col>
        </Row>
      </Grid>
    );

    return (
      <div className="character-sheet">
        <CharacterSheetSidebar
          character={this.props.character}
          exitCharacterSheetCB={this.props.exitCharacterSheetCB}
        />
        {CS_GRID}
      </div>
    );
  }
}

CharacterSheet.propTypes = {
  exitCharacterSheetCB: React.PropTypes.func.isRequired,
  character: React.PropTypes.object.isRequired
};

export default CharacterSheet;
