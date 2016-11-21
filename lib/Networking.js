//
// Broken Mold networking library
//
// Note that this is incomplete, it contains only code from the prototype
//

'use strict';

import dgram from 'dgram';
import ip from 'ip';
import net from 'net';
import os from 'os';
import fs from 'fs';
import JsonSocket from 'json-socket';

const IP_ADDR = ip.address();
const NET_IFACE = networkInterface();
const UDP_PORT = 19747;
const UDP_HOST = ip.subnet(IP_ADDR, NET_IFACE.netmask).broadcastAddress;
const TCP_PORT = 1974;
const HOSTNAME = os.hostname();
const UDP_DM_MSG = 'D5 DM host - ';
const UDP_SHARE_MSG = 'D5 share request - ';
const CHAR_LOCATION = './test/Characters/';
const DM_FOLDER = CHAR_LOCATION + 'DMTemp/';

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
export function startUDPListen(DM, cb, charName) {
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

  UDP.socket.on('message', (message, remote) => {
    if (DM && String(message).substring(0,UDP_DM_MSG.length) === UDP_DM_MSG) {
      stopUDPListen();
      startTCPClient(remote.address, true, cb, charName);
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
      try {
        fs.writeFileSync(DM_FOLDER + receivedCharacter.name + '.json', wholeMessage);
      } catch (e) {
        console.log('Error in writing file');
      }
      func(receivedCharacter.name + '.json', c);
      //broadcast(c.name + '> ' + data, c);
    });

    // Remove the client from the list when it leaves
    c.on('close', () => {
      console.log('client disconnected');
      if (TCP !== null) {
        TCP.clients.splice(TCP.clients.indexOf(c), 1);
      }
      if (DM) {
        func2(c);
      }
      //broadcast(c.name + ' left the server.');
    });

    if (characterToShare) {
      func(characterToShare, c);
    }
  });

  TCP.server.listen(TCP_PORT);
  TCP.dm = DM;

  console.log('TCP server running on port ' + TCP_PORT);
}

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
export function startTCPClient(address, DM, cb, charName) {
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
    if (DM) {
      //write character to DM
      var temp = JSON.parse(fs.readFileSync(CHAR_LOCATION + charName));
      TCP.client.sendMessage(temp);
      cb();
    }
  });

  TCP.client.on('data', (data) => {
    if (DM) {
      // getting info back from DM
    } else {
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
      sentCharacter.name = sentCharacter.name + '-shared';
      wholeMessage = JSON.stringify(sentCharacter, null, 2);
      try {
        fs.writeFileSync(CHAR_LOCATION + sentCharacter.name + '.json', wholeMessage);
      } catch (e) {
        console.log('Error in writing file');
      }
      cb();
    }
  });

  TCP.client.on('close', () => {
    TCP = null;
    console.log('Connection closed');
    cb();
  });

  TCP.dm = DM;
}

export function closeTCPClient() {
  if (TCP === null) {
    return;
  }

  console.log(TCP);
  TCP.client._socket.destroy();
  TCP = null;

  console.log('stopTCPClient');
}
