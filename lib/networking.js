//
// Broken Mold networking library
//
// Note that this is incomplete, it contains only code from the prototype
//

'use strict';

import 'os';
import 'dgram';
import 'net';

const IP_ADDR = ipAddress();
const UDP_PORT = 19747;
const UDP_HOST = broadcastAddress();
const TCP_PORT = 1974;
const HOSTNAME = os.hostname();

var UDP = {};
var TCP = {};

// Find the broadcast address of the network
function broadcastAddress() {
  var interfaces = os.networkInterfaces();

  for (let i in interfaces) {
    for (let j in interfaces[i]) {
      if (interfaces[i][j].address === ipAddr) {
        netInterface = interfaces[i][j];
        break;
      }
    }
  }

  return ip.subnet(netInterface.address, netInterface.netmask).broadcastAddress;
}

// Find the machine's network IP address
function ipAddress() {
  var interfaces = os.networkInterfaces();

  var addresses = [];
  for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
          var address = interfaces[k][k2];
          if (address.family === 'IPv4' && !address.internal) {
              addresses.push(address.address);
          }
      }
  }
}

// Start a UDP client that will send messages to the broadcast address
export function startUDPBroadcast() {
  if (UDP !== {}) {
    console.error('ERROR: UDP socket already in use!');
    return;
  }
  console.log('startUDPBroadcast');

  var message = new Buffer('D5 host - ' + HOSTNAME);

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
  if (UDP === {}) {
    return;
  }

  clearInterval(UDP.timer);
  UDP.socket.close();
  UDP = {};

  console.log('stopUDPBroadcast');
}

// Start a UDP server that will listen for messages from the broadcast address
export function startUDPListen() {
  if (UDP !== {}) {
    console.error('ERROR: UDP socket already in use!');
    return;
  }
  console.log('startUDPListen');

  UDP.socket = dgram.createSocket('udp4');

  UDP.socket.on('listening', () => {
    var address = UDP.socket.address();
    console.log('UDP Server listening on ', address.address, ':', address.port);
  });

  server.on('message', (message, remote) => {
    console.log(remote.address + ':' + remote.port + ' - ' + message);
  });

  UDP.socket.bind(UDP_PORT);
}

// Stop the active UDP server listening and delete it
export function stopUDPListen() {
  if (UDP === {}) {
    return;
  }

  UDP.socket.close();
  UDP = {};

  console.log('stopUDPListen');
}

// Start a TCP server that accepts incoming clients and can broadcast to them
export function startTCPServer() {
  if (TCP !== {}) {
    console.error('ERROR: TCP socket already in use!');
    return;
  }
  console.log('startTCPServer');

  // Keep track of clients
  TCP.clients = [];

  TCP.server = net.createServer((c) => {
    // Identify the incoming client
    c.name = c.remoteAddress + ':' + c.remotePort;

    // Put the new client in the list
    TCP.clients.push(c);

    // Send a welcome message and announce the new client
    c.write('Welcome ' + c.name + '\n');
    broadcast(c.name + ' joined the server', c);

    // Handle incoming messages from clients
    c.on('data', (data) => {
      console.log(c.name + '> ' + data);
      broadcast(c.name + '> ' + data, c);
    });

    // Remove the client from the list when it leaves
    c.on('end', () => {
      TCP.clients.splice(TCP.clients.indexOf(c), 1);
      broadcast(c.name + ' left the server.');
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
  });

  TCP.server.listen(TCP_PORT);
  console.log('TCP server running on port ' + TCP_PORT);
}

// Start a TCP client that is connected to address:TCP_PORT
export function startTCPClient(address) {
  if (TCP !== {}) {
    console.error('ERROR: TCP socket already in use!');
    return;
  }
  if (net.isIPv4(address) === false) {
    console.error('ERROR: %s not in IPv4 format!', address);
    return;
  }
  console.log('startTCPClient');

  TCP.client = new net.Socket();

  TCP.client.connect(TCP_PORT, address, () => {
    console.log('Client connected to port ' + TCP_PORT);
    TCP.client.write('Hello server! Love, Client.');
  });

  TCP.client.on('data', (data) => {
    console.log('Received: ' + data);
    // client.destroy(); // kill the client
  });

  TCP.client.on('close', () => {
    console.log('Connection closed');
  });
}
