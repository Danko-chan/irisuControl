const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  const iconPath = path.join(__dirname, '../../resources/icons/icon.png');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 850,
    minWidth: 1000,
    minHeight: 600,
    backgroundColor: '#0a0a0a',
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const isDev = process.argv.includes('--dev');

  if (isDev) {
    // Load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Load from built files
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }

}

function getMainWindow() {
  return mainWindow;
}

app.whenReady().then(() => {
  createWindow();

  // Import IPC handlers after window is created
  require('./ipc/projects-ipc');
  require('./ipc/processes-ipc');
  require('./ipc/logs-ipc');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

module.exports = { getMainWindow };