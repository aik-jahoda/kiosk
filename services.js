const express = require('express');
const router = require('./services/router');
const networkManager = require('./services/models/network-manager');

/**
 * Services expose kiosk features over HTTP, both locally and via the
 * Web of Things.
 */
var Services = {

  /**
   * Start system services.
   *
   * @param {integer} port HTTP port.
   */
  start: function(port) {
    // Start network manager
    networkManager.start();

    // Start HTTP server
    this.server = express();
    this.server.use(router);
    this.server.listen(port, () =>
      console.log(`Starting system services on port ${port}...`));
  }
}

module.exports = Services;
