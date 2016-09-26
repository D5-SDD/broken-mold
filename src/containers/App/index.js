// 
// App.react.js
// 
// This component is the skeleton around the actual pages, and should only
// contain code that should be seen on all pages. (e.g. navigation bar)
//

'use strict';

import React from 'react';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className='broken_mold'>
        <h1>Welcome to Broken Mold</h1>
      </div>
    );
  }
}

export default AppContainer;
