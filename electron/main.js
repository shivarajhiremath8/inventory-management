const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the React app
  mainWindow.loadURL('http://localhost:3000');

  // Start the Python backend
  startBackend();

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (backendProcess) {
      backendProcess.kill();
    }
  });
}

function startBackend() {
  const backendPath = path.join(__dirname, '..', 'backend');
  backendProcess = spawn('python', ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
    cwd: backendPath,
    stdio: 'inherit'
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
