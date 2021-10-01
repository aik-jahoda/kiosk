/**
 * Krellian Kiosk.
 *
 * Main script starts up kiosk chrome and services.
 */
const {app, BrowserWindow, ipcMain} = require('electron');
const parseArgs = require('minimist');
const url = require('url');
const path = require('path');
const services = require('./services');
const DEFAULT_HTTP_PORT = 8080;

function start() {
  // Parse command line arguments
  let args = parseArgs(process.argv.slice(2));
  let httpPort = args.p || DEFAULT_HTTP_PORT;
  
  // Respond to requests from the renderer process asking for the HTTP port
  ipcMain.handle('getHttpPort', async (event, path) => {
    return httpPort;
  });

  // Start system services
  console.log('Starting system services...');
  services.start(httpPort);

  // Create the main window
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      contextIsolation: false
    }
  });

  // Load system chrome into main window
  console.log('Starting system chrome...');
  mainWindow.loadURL('file://' + path.join(__dirname, 'chrome/index.html'));

  // Inject reference to system chrome into UserAgent model in services for IPC
  services.setChrome(mainWindow.webContents);

  // Uncomment the following line to open DevTools
  //mainWindow.webContents.openDevTools();
}

app.on('ready', start);
