'use strict';

import React from 'react';
import CharacterMenu from '../components/CharacterMenu';
import Button from 'react-bootstrap/lib/Button';

import '../stylesheets/containers/CharacterView';

class CharacterView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="character-view">
        <nav className="navigation">
          <Button bsStyle="success" bsSize="small">
            New
          </Button>
          <Button bsStyle="success" bsSize="small">
            Load
          </Button>
          <Button bsStyle="success" bsSize="small">
            Share
          </Button>
        </nav>
        <CharacterMenu characterMap={this.props.characterMap} />
      </div>
    );
  }
}

CharacterView.propTypes = {
  characterMap: React.PropTypes.array
};

export default CharacterView;
