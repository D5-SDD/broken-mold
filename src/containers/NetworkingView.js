'use strict';

// Import libraries
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

// Import internal libraries
import {UDP, startUDPBroadcast, stopUDPBroadcast} from '../../lib/Networking';

// MIKE! THIS IS A TUTORIAL FOR YOU!
// ANY FUNCTIONS THAT YOU NEED TO CALL/TEST YOU IMPORT
// IN THE CURLY BRACES ABOVE THIS COMMENT.
// TO ASSIGN THAT FUNCTION TO BE CALLED BY A BUTTON,
// CHANGE THE ONCLICK PROPERTY OF THAT BUTTON TO CALL THAT FUNCTION

class NetworkingView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
      <div className="networking-view">
        <nav className="navigation" id="header">
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={startUDPBroadcast()}
          >
            Start UDP
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={stopUDPBroadcast}
          >
            End UDP
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={() => {
              console.log('Future stuff');
            }}
          >
            UDP Listen
          </Button>
        </nav>
      </div>
		);
	}
}

NetworkingView.propTypes = {};

export default NetworkingView;
