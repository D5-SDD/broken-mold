'use strict';

import React from 'react';
import CharacterMenu from '../components/CharacterMenu';

import '../stylesheets/containers/CharacterView';

class CharacterView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="character-view">
        <CharacterMenu/>
        <h2>This is the Character Tab</h2>
      </div>
    );
  }
}

export default CharacterView;
