/**
 * Krellian Kiosk.
 *
 * Main script starts up kiosk chrome and services.
 */
const {app, BrowserWindow, Menu} = require('electron');
const parseArgs = require('minimist');
const url = require('url');
const path = require('path');
const services = require('./services');
const DEFAULT_HTTP_PORT = 8080;

function start() {
  // Parse command line arguments
  let args = parseArgs(process.argv.slice(2));
  let httpPort = args.p || DEFAULT_HTTP_PORT;

  // Start system services
  console.log('Starting system services...');
  services.start(httpPort);

  // Create the main window
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      // TODO: Replace deprecated feature https://github.com/krellian/kiosk/issues/82
      enableRemoteModule: true
    }
  });

  // TODO: Remove workaround https://github.com/krellian/kiosk/issues/83
  Menu.setApplicationMenu(null);

  // Load system chrome into main window
  console.log('Starting system chrome...');
  // TODO: Replace with WHATWG URL API https://github.com/krellian/kiosk/issues/84
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'chrome/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Inject reference to system chrome into UserAgent model in services for IPC
  services.setChrome(mainWindow.webContents);

  // Uncomment the following line to open DevTools
  //mainWindow.webContents.openDevTools();
}

app.on('ready', start);
