'use strict';

const { ipcMain } = require('electron');
const EventEmitter = require('events');

/**
 * UserAgent is responsible for monitoring and controlling system chrome from
 * services via Electron IPC.
 */
class UserAgent extends EventEmitter {
  /**
   * Start user agent model and start listening for events from Chrome.
   */
  start() {
    this.url = '';
    ipcMain.on('locationchange', this.handleLocationChange.bind(this));
  }

  /**
   * Load the given URL on the kiosk.
   * 
   * @param {string} url The URL to load.
   */
  go(url) {
    this.chrome.send('go', url);
  }

  /** 
   * Set a reference to mainWindow.webcontents in order to send messages to
   * chrome over IPC.
  */
  setChrome(chrome) {
    this.chrome = chrome;
  }

  getUrl() {
    return this.url;
  }

  /**
   * Handle a navigation to a new location.
   * 
   * @param {Event} event The locationchange event.
   * @param {string} url The URL that was navigated to.
   */
  handleLocationChange(event, url) {
    this.url = url;
    this.emit('locationchange', url);
  }
}

module.exports = new UserAgent();
