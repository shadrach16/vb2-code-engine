import { app, BrowserWindow, Menu, screen } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url'; // <-- NEW: Import fileURLToPath
import { format as formatUrl } from 'url';
import { promises as fs } from 'fs';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // <-- NEW: Define __dirname

const isDevelopment = true;

let mainWindow;
let aboutWindow = null;

function createMainWindow() {
  // Get primary display information
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize; // Use workAreaSize to exclude taskbars/docks

  const windowWidth = Math.floor(width * 0.8);
  const windowHeight = Math.floor(height * 0.8);

  const window = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: Math.floor(width * 0.1),
    y: Math.floor(height * 0.1),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For Electron security, consider setting this to true and using a preload script.
      enableRemoteModule: true, // Deprecated, consider alternative for better security.
      preload: path.join(__dirname, 'preload.js')
    },
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
    window.loadURL(`http://localhost:3000`);
  } else {
    // In production, show a loading screen first
    const loadingHtmlPath = path.join(__dirname, 'loading.html');
    const indexHtmlPath = path.join(__dirname, 'build', 'index.html');

    fs.access(loadingHtmlPath)
      .then(() => {
        window.loadURL(formatUrl({
          pathname: loadingHtmlPath,
          protocol: 'file',
          slashes: true
        }));

        setTimeout(() => {
          window.loadURL(formatUrl({
            pathname: indexHtmlPath,
            protocol: 'file',
            slashes: true
          })).catch(err => {
            console.error("Failed to load main app HTML:", err);
            window.loadFile(path.join(__dirname, 'error.html'));
          });
        }, 1500); // Show loader for 1.5 seconds, adjust as needed
      })
      .catch(() => {
        window.loadURL(formatUrl({
          pathname: indexHtmlPath,
          protocol: 'file',
          slashes: true
        })).catch(err => {
          console.error("Failed to load main app HTML directly:", err);
          window.loadFile(path.join(__dirname, 'error.html'));
        });
      });
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  // Setup Menu for navigation (template remains the same)
  const template = [
    {
      label: 'Tool',
      submenu: [
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+Left',
          click() {
            if (window.webContents.canGoBack()) {
              window.webContents.goBack();
            }
          }
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+Right',
          click() {
            if (window.webContents.canGoForward()) {
              window.webContents.goForward();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click() {
            window.webContents.reload();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About VibeBuilder',
          click() {
            createAboutWindow();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return window;
}

function createAboutWindow() {
  if (aboutWindow) {
    aboutWindow.focus();
    return;
  }

  aboutWindow = new BrowserWindow({
    width: 400,
    height: 450,
    resizable: false,
    minimizable: false,
    maximizable: false,
    show: false,
    modal: true,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // You may need to create a specific preload for the about window
      // preload: path.join(__dirname, 'about-preload.js')
    },
  });

  aboutWindow.loadURL(formatUrl({
    pathname: path.join(__dirname, 'about.html'),
    protocol: 'file',
    slashes: true
  }));

  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show();
  });

  aboutWindow.on('closed', () => {
    aboutWindow = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
});