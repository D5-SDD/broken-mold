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
import jsonSocket from 'json-socket';

const IP_ADDR = ip.address();
const NET_IFACE = networkInterface();
const UDP_PORT = 19747;
const UDP_HOST = ip.subnet(IP_ADDR, NET_IFACE.netmask).broadcastAddress;
const TCP_PORT = 1974;
const HOSTNAME = os.hostname();
const UDP_DM_MSG = 'D5 DM host - ';
const UDP_SHARE_MSG = 'D5 share request - ';
const CHAR_LOCATION = './test/Characters/';

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
    console.error('ERROR: UDP socket already in use!');
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
export function startUDPListen() {
  if (UDP !== null) {
    console.error('ERROR: UDP socket already in use!');
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
    if (String(message).substring(0,UDP_DM_MSG.length) === UDP_DM_MSG) {
      startTCPClient(remote.address, true);
      stopUDPListen();
    }
    else if (String(message).substring(0, UDP_SHARE_MSG.length) === UDP_SHARE_MSG) {
      startTCPClient(remote.address, false);
      stopUDPListen();
    }
  });

  UDP.socket.bind(UDP_PORT);
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
export function startTCPServer(func, charactersToShare) {
  if (TCP !== null) {
    console.error('ERROR: TCP socket already in use!');
    return;
  }
  console.log('startTCPServer');

  TCP = {};

  // Keep track of clients
  TCP.clients = [];

  TCP.server = net.createServer((c) => {
    c = new jsonSocket(c);
    // Identify the incoming client
    c.name = c.remoteAddress + ':' + c.remotePort;

    // Put the new client in the list
    TCP.clients.push(c);

    // Send a welcome message and announce the new client
    //c.write('Welcome ' + c.name + '\n');
    //broadcast(c.name + ' joined the server', c);
    
    // Handle incoming messages from clients
    c.on('data', (data) => {
      //console.log(c.name + '> ' + data);
      //console.log(String(data));
      var temp = String(data).split('#');
      console.log(temp[1]);
      var temp2 = JSON.parse(temp[1]);
      console.log(temp2);
      
      temp2.name = temp2.name + ' - DMTemp';
      temp[1] = JSON.stringify(temp2);
      try {
        fs.writeFileSync(CHAR_LOCATION + temp2.name + '.json', temp[1]);
      } catch (e) {
        console.log('Error in writing file');
      }
      func(temp2.name + ' - DMTemp.json');
      //broadcast(c.name + '> ' + data, c);
    });

    // Remove the client from the list when it leaves
    c.on('end', () => {
      if (TCP !== null) {
        TCP.clients.splice(TCP.clients.indexOf(c), 1);
      }
      //broadcast(c.name + ' left the server.');
    });

    // Send a message to all clients
    function broadcast(message, sender) {
      // Append newline if needed
      if (message[-1] !== '\n') {
        message += '\n';
      }

      TCP.clients.forEach((client) => {
        // Don't want to send it to sender
        if (client === sender) {
          return;
        }
        client.write(message);
      });
      // Log it to server output too
      process.stdout.write(message);
    }
    
    if (charactersToShare.length > 0)
    {
      func(charactersToShare, c);
    }
  });

  TCP.server.listen(TCP_PORT);
  console.log('TCP server running on port ' + TCP_PORT);
}

export function closeTCPServer() {
   if (!TCP || !TCP.clients) {
    return;
  }
  for (let i = 0; i < TCP.clients.length; i++)
  {
    TCP.clients[i].end();
  }  
  TCP.server.close();
  TCP = null;

  console.log('stopTCPServer');
}
// Start a TCP client that is connected to address:TCP_PORT
export function startTCPClient(address, DM) {
  console.log('start');
  if (TCP !== null) {
    console.error('ERROR: TCP socket already in use!');
    return;
  }
  if (net.isIPv4(address) === false) {
    console.error('ERROR: %s not in IPv4 format!', address);
    return;
  }
  console.log('startTCPClient');

  TCP = {};

  TCP.client = new jsonSocket(new net.Socket());

  TCP.client.connect(TCP_PORT, address, () => {
    console.log('Client connected to port ' + TCP_PORT);
    if (DM) {
      //write character to DM
      var temp = JSON.parse(fs.readFileSync(CHAR_LOCATION + "Itzal.json"));
      console.log(temp);
      TCP.client.sendMessage(temp);
    }
  });

  TCP.client.on('data', (data) => {
    if (DM) {
      //write character to DM
      //var temp = fs.readFileSync(CHAR_LOCATION + "Itzal.json")
      //TCP.client.write(temp);
    }
    else {
      console.log(String(data));
      
      data = String(data).split('#');
      var temp = JSON.parse(data[1])
      temp.name = temp.name + ' - shared';
      data[1] = JSON.stringify(temp, null, 2);
      try {
        fs.writeFileSync(CHAR_LOCATION + temp.name + '.json', data[1]);
      } catch (e) {
        console.log('Error in writing file');
      }
      
    }
  });

  TCP.client.on('close', () => {
    TCP = null;
    console.log('Connection closed');
  });
}

export function closeTCPClient() {
  if (TCP === null) {
    return;
  }

  TCP.client.close();
  TCP = null;

  console.log('stopTCPClient');
}