const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const DEFAULT_HOST = 'http://localhost';
const DEFAULT_PORT = '8080';
const DEFAULT_PAGE = '/display';

/**
 * System chrome loaded inside the top level window.
 */
const Chrome = {
  httpPort: DEFAULT_PORT,

  /**
   * Start Chrome.
   */
  start: async function() {
    console.log('Starting chrome...');
    this.webview = document.getElementById('webview');

    // Get local HTTP port number for system services
    this.httpPort = await ipcRenderer.invoke('getHttpPort');

    // If port configured by systemd, assume port 80
    if (this.httpPort == 'systemd') {
      this.httpPort = '80';
    }

    // Listen for navigations
    this.webview.addEventListener('did-navigate',
      this.handleNavigation.bind(this));

    // Load placeholder page
    this.webview.src = DEFAULT_HOST + ':'  + this.httpPort + DEFAULT_PAGE;

    // Uncomment the following two lines to open developer tools for webview
    //this.webview.addEventListener('dom-ready',
    //  e => { this.webview.openDevTools(); });

    // Listen for load URL requests
    ipcRenderer.on('go', (event, url) => {
      this.navigate(url);
    });
  },

  /**
   * Navigate the kiosk to the given URL.
   * 
   * @param {string} url URL to navigate to.
   */
  navigate: function(url) {
    this.webview.src = url;
  },

  /**
   * Handle a navigation event.
   * 
   * @param {Event} event Navigation event to handle.
   */
  handleNavigation: function(event) {
    let url = event.url;
    // Filter out start page
    if (url == DEFAULT_HOST + ':'  + this.httpPort + DEFAULT_PAGE + '/') {
      url = '';
    }
    // Notify the main process of location change
    ipcRenderer.send('locationchange', url);
  }
}

/**
  * Start Kiosk on page load.
  */
window.addEventListener('load', function chrome_onLoad() {
  window.removeEventListener('load', chrome_onLoad);
  Chrome.start();
});
