// Networking.js:
// This file defines the functions related to networking
// for the application, including UDP, TCP, Dungeon Master
// logic, and sharing logic.

'use strict';

import dgram from 'dgram';
import ip from 'ip';
import net from 'net';
import os from 'os';
import fs from 'fs';
import JsonSocket from 'json-socket';
import {CHARACTER_DIR} from './Character';

const IP_ADDR = ip.address();
const NET_IFACE = networkInterface();
const UDP_PORT = 19747;
const UDP_HOST = ip.subnet(IP_ADDR, NET_IFACE.netmask).broadcastAddress;
const TCP_PORT = 1974;
const HOSTNAME = os.hostname();
const UDP_DM_MSG = 'D5 DM host - ';
const UDP_SHARE_MSG = 'D5 share request - ';
const CHAR_LOCATION = CHARACTER_DIR;
export const DM_DIR = CHAR_LOCATION + 'DMTemp/';

export var UDP = null;
export var TCP = null;

// Find the current network interface
function networkInterface() {
  var interfaces = os.networkInterfaces();

  for (let i in interfaces) {
    for (let j in interfaces[i]) {
      var iface = interfaces[i][j];
      if (iface.address === IP_ADDR) {
        return iface;
      }
    }
  }
}

// Start a UDP client that will send messages to the broadcast address
export function startUDPBroadcast(DM) {
  if (UDP !== null) {
    console.log('ERROR: UDP socket already in use!');
    return;
  }
  console.log('startUDPBroadcast');

  UDP = {};

  var message;
  if (DM) {
    message = new Buffer(UDP_DM_MSG + HOSTNAME);
  } else {
    message = new Buffer(UDP_SHARE_MSG + HOSTNAME);
  }

  UDP.socket = dgram.createSocket('udp4');

  UDP.timer = setInterval(function () {
    UDP.socket.send(message, 0, message.length, UDP_PORT, UDP_HOST, (err) => {
      console.log('UDP message sent to ' + UDP_HOST + ':' + UDP_PORT);
      if (err) {
        UDP.socket.close();
      }
    });
  }, 2500);
  UDP.dm = DM;
}

// Stop the active UDP client broadcasting and delete it
export function stopUDPBroadcast() {
  if (UDP === null) {
    return;
  }

  clearInterval(UDP.timer);
  UDP.socket.close();
  UDP = null;

  console.log('stopUDPBroadcast');
}

// Start a UDP server that will listen for messages from the broadcast address
export function startUDPListen(DM, cb, charName, cb2) {
  if (UDP !== null) {
    console.log('ERROR: UDP socket already in use!');
    return;
  }
  console.log('startUDPListen');

  UDP = {};

  UDP.socket = dgram.createSocket('udp4');

  UDP.socket.on('listening', () => {
    var address = UDP.socket.address();
    console.log('UDP Server listening on ', address.address, ':', address.port);
  });

  // On connect, start TCP client based on if connecting to DM
  UDP.socket.on('message', (message, remote) => {
    console.log(message);
    if (DM && String(message).substring(0,UDP_DM_MSG.length) === UDP_DM_MSG) {
      stopUDPListen();
      startTCPClient(remote.address, true, cb, charName, cb2);
    } else if (!DM && String(message).substring(0, UDP_SHARE_MSG.length) === UDP_SHARE_MSG) {
      stopUDPListen();
      startTCPClient(remote.address, false, cb, '');
    }
  });

  UDP.socket.bind(UDP_PORT);
  UDP.dm = DM;
}

// Stop the active UDP server listening and delete it
export function stopUDPListen() {
  if (UDP === null) {
    return;
  }

  UDP.socket.close();
  UDP = null;

  console.log('stopUDPListen');
}

// Start a TCP server that accepts incoming clients and can broadcast to them
export function startTCPServer(func, characterToShare, func2, DM) {
  if (TCP !== null) {
    console.log('ERROR: TCP socket already in use!');
    return;
  }
  console.log('startTCPServer');

  TCP = {};

  // Keep track of clients
  TCP.clients = [];

  TCP.server = net.createServer((c) => {
    c = new JsonSocket(c);
    // Identify the incoming client
    c.name = c.remoteAddress + ':' + c.remotePort;

    // Put the new client in the list
    TCP.clients.push(c);

    // Handle incoming messages from clients
    // Reads in JSON and writes it to the DMTemp folder
    c.on('data', (data) => {
      data = String(data).split('#');
      var wholeMessage = '';
      for (let i = 1; i < data.length; i++) {
        if (i === 1) {
          wholeMessage += data[i];
        } else {
          wholeMessage += ('#' + data[i]);
        }
      }
      var receivedCharacter = JSON.parse(wholeMessage);

      // create the DM folder if it does not exist
      if (!fs.existsSync(DM_DIR)) {
        fs.mkdirSync(DM_DIR);
      }

      try {
        fs.writeFileSync(DM_DIR + receivedCharacter.name + '.json', wholeMessage);
      } catch (e) {
        console.log('Error in writing file');
      }
      func(receivedCharacter.name + '.json', c);
    });

    // Remove the client from the list when it leaves
    c.on('close', () => {
      console.log('client disconnected');
      if (TCP !== null) {
        TCP.clients.splice(TCP.clients.indexOf(c), 1);
      }
      // If connected to the DM, need to run the call back function to disconnect the client
      if (DM) {
        func2(c);
      }
    });
    // If there is characters to share with a client, use the cb to send the character
    if (characterToShare) {
      func(characterToShare, c);
    }
  });

  TCP.server.listen(TCP_PORT);
  TCP.dm = DM;

  console.log('TCP server running on port ' + TCP_PORT);
}

// Closes the TCP server and disconnects all clients
export function closeTCPServer() {
   if (!TCP || !TCP.clients) {
    return;
  }
  for (let i = 0; i < TCP.clients.length; i++) {
    TCP.clients[i]._socket.destroy();
  }
  TCP.server.close();
  TCP = null;

  console.log('stopTCPServer');
}
// Start a TCP client that is connected to address:TCP_PORT
export function startTCPClient(address, DM, cb, charName, cb2) {
  if (TCP !== null) {
    console.log('ERROR: TCP socket already in use!');
    return;
  }
  if (net.isIPv4(address) === false) {
    console.error('ERROR: %s not in IPv4 format!', address);
    return;
  }
  console.log('startTCPClient');

  TCP = {};

  TCP.client = new JsonSocket(new net.Socket());

  TCP.client.connect(TCP_PORT, address, () => {
    console.log('Client connected to port ' + TCP_PORT);
    // Write character to DM if connected to one
    if (DM) {
      var temp = JSON.parse(fs.readFileSync(CHAR_LOCATION + charName));
      TCP.client.sendMessage(temp);
      cb();
    }
  });

  // Handle incoming data
  TCP.client.on('data', (data) => {
    data = String(data).split('#');
    var wholeMessage = '';
    for (let i = 1; i < data.length; i++) {
      if (i === 1) {
        wholeMessage += data[i];
      } else {
        wholeMessage += ('#' + data[i]);
      }
    }
    var sentCharacter = JSON.parse(wholeMessage);
    // Name the character based on if it's a shared character or from the DM
    sentCharacter.name = DM
    ? sentCharacter.name
    : sentCharacter.name + '-shared';
    wholeMessage = JSON.stringify(sentCharacter, null, 2);
    try {
      fs.writeFileSync(CHAR_LOCATION + sentCharacter.name + '.json', wholeMessage);
    } catch (e) {
      console.log('Error in writing file');
    }
    // Use proper call back based on DM or sharing
    if (!DM) {
      cb();
    } else {
      cb2();
    }
  });

  TCP.client.on('close', () => {
    TCP = null;
    console.log('Connection closed');
    cb();
  });

  TCP.dm = DM;
}

// Closes the TCP client
export function closeTCPClient() {
  if (TCP === null) {
    return;
  }

  TCP.client._socket.destroy();
  TCP = null;

  console.log('stopTCPClient');
}
