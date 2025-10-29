const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

let mainWin = null;
let settingsWin = null;

function createWindow() {
  const win = new BrowserWindow({
    name: "main",
    width: 1200,
    height: 800,
    minWidth: 400,
    minHeight: 300,
    show: false,
    frame: false,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      //devTools: false
    },
  });
  win.winName = 'main';

  mainWin = win;

  if (isDev) {
    win.loadURL('http://localhost:5173');
    //win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  win.once('ready-to-show', () => win.show());
}

function createSettingsWindow() {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.focus();
    return;
  }

  settingsWin = new BrowserWindow({
    name: 'settings',
    width: 600,
    height: 480,
    minWidth: 400,
    minHeight: 300,
    resizable: true,
    minimizable: false,
    maximizable: false,
    parent: mainWin || undefined,
    modal: false,
    show: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  settingsWin.winName = 'settings';

  if (isDev) {
    settingsWin.loadURL('http://localhost:5173/#/settings');
  } else {
    const indexPath = `file://${path.join(__dirname, '..', 'dist', 'index.html')}#/settings`;
    settingsWin.loadURL(indexPath);
  }

  settingsWin.once('ready-to-show', () => settingsWin.show());

  settingsWin.on('closed', () => {
    settingsWin = null;
  });
}

ipcMain.on('open-settings', () => {
  createSettingsWindow();
});

ipcMain.on('app-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) win.minimize();
});

ipcMain.on('app-toggle-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed()) return;
  if (win.isMaximized()) win.unmaximize();
  else win.maximize();
});

ipcMain.on('app-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) win.maximize();
});

ipcMain.on('app-unmaximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) win.unmaximize();
});

ipcMain.on('app-close', () => {
  console.log(BrowserWindow.getAllWindows()[1]);
  BrowserWindow.getAllWindows().forEach(w => w.close());
  app.quit();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

function closeWindow(windowName) {
  BrowserWindow.getAllWindows().forEach((win) => {
    try {
      if (!win || win.isDestroyed()) return;
      const nameProp = win.winName || win.name || (typeof win.getTitle === 'function' && win.getTitle()) || null;
      //console.log('closeWindow: checking', nameProp, 'against', windowName);
      if (nameProp === windowName) {
        win.close();
      }
    } catch (err) {
    }
  });
}

ipcMain.on('close-window', (event, windowName) => {
  if (typeof windowName === 'string') closeWindow(windowName);
});