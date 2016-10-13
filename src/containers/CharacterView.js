'use strict';

import React, {Component} from 'react';

import '../stylesheets/containers/CharacterView';

class CharacterView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="character-view">
        <h2>This is the Character Tab</h2>
      </div>
    );
  }
}

export default CharacterView;
