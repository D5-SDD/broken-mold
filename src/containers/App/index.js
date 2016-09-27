//
// App.react.js
//
// This component is the skeleton around the actual pages, and should only
// contain code that should be seen on all pages. (e.g. navigation bar)
//

'use strict';

import React from 'react';
import Tab from '../../components/Tab';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tabs">
        <Tab />
        <Tab />
      </div>
    );
  }
}

export default AppContainer;
