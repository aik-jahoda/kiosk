const express = require('express');
const router = require('./router');
const database = require('./database');
const broadcast = require('./broadcast');
const credentials = require('./models/credentials');
const network = require('./models/network');
const userAgent = require('./models/user-agent');
const SD_LISTEN_FDS_START = 3; // First file descriptor number passed by systemd

/**
 * Services expose kiosk features over HTTP, both locally and via the
 * Web of Things.
 */
var Services = {

  /**
   * Start system services.
   *
   * @param {(number|string)} port HTTP port.
   */
  start: function(port) {
    // Start database and credential manager
    database.start()
    .then(() => credentials.start())
    .catch((error) => {console.log(error)});

    // Start network manager
    network.start();

    // Start HTTP server
    if (port == 'systemd' && process.env.LISTEN_FDS) {
      // If port number is set to 'systemd' use file descriptor from systemd
      console.log('Getting HTTP port from systemd...');
      port = {
        fd: SD_LISTEN_FDS_START
      };
    } else {
      console.log(`Setting HTTP port to ${port}...`);
    }
    this.server = express();
    this.server.use(router);
    this.server.listen(port, () =>
      console.log(`Starting HTTP server...`));

    // Start user agent
    userAgent.start();

    // Start DNS-SD broadcast
    broadcast.start(port);

  },

  setChrome: function(chrome) {
    userAgent.setChrome(chrome);
  }


}

module.exports = Services;
