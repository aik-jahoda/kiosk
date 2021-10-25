'use strict';

const dnssd = require('dnssd');

/**
 * The broadcast service advertises a .local domain for the kiosk's web server
 * using DNS-SD, which resolves to its local IP address using mDNS.
 */
class Broadcast {

  /**
   * Start the broadcast service.
   * 
   * @param {number} port Port number of HTTP server to broadcast.
   */
   start(port) {
    const broadcast = new dnssd.Advertisement(
      dnssd.tcp('http'),
      port,
      {
        'name': 'Krellian Kiosk',
        'host': 'kiosk'
      }
    );
    broadcast.on('error', (e) => {
      console.error('Error broadcasting local domain ' + e);
    });
    broadcast.start();
    console.log('Broadcasting local domain kiosk.local...');
  }
}

module.exports = new Broadcast();