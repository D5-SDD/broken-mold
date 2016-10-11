'use strict';

import React from 'react';
import CharacterMenu from '../components/CharacterMenu';

class CharacterView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="character-view">
        <CharacterMenu/>
      </div>
    );
  }
}

export default CharacterView;
