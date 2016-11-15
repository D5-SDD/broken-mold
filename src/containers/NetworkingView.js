'use strict';

// Import libraries
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

// Import internal libraries
import {UDP, TCP, startUDPBroadcast, stopUDPBroadcast, startUDPListen} from '../../lib/Networking';

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
            onClick={ () => {
              startUDPBroadcast(true);
            }}
          >
            Start UDP
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={() => {
              stopUDPBroadcast();
            }}
          >
            End UDP
          </Button>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={() => {
              startUDPListen();
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
