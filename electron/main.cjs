const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');

const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

let mainWin = null;
let settingsWin = null;

function createWindow() {
    const win = new BrowserWindow({
        name: "main",
        width: 1200,
        height: 800,
        minWidth: 800,
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

ipcMain.handle('import-file', async (event, srcPath) => {
    try {
        if (typeof srcPath !== 'string' || srcPath.length === 0) throw new Error('invalid source path');
        const destDir = path.join(app.getPath('userData'), 'imports');
        await fs.mkdir(destDir, { recursive: true });
        console.log('Importing file from', srcPath, 'to', destDir);
        const base = path.basename(srcPath);
        const timestamp = Date.now();
        const destName = `${timestamp}-${base}`;
        const destPath = path.join(destDir, destName);

        await fs.copyFile(srcPath, destPath);

        const indexPath = path.join(destDir, 'index.json');
        let index = {};
        try {
            const raw = await fs.readFile(indexPath, 'utf8');
            index = JSON.parse(raw || '{}');
        } catch (e) {
            index = {};
        }

        const keys = Object.keys(index).filter(k => /^Imported Script \(\d+\)$/.test(k));
        const next = keys.length + 1;
        const entryKey = `Imported Script (${next})`;

        const now = new Date();
        const addedAt = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`;

        index[entryKey] = {
            fileDirectory: destPath,
            description: '',
            addedAt,
            lastInteractedAt: addedAt,
        };

        await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');

        try {
            const pyPath = path.join(__dirname, '..', 'src', 'main.py');
            const py = spawn(process.platform === 'win32' ? 'python' : 'python3', [pyPath, destPath], { detached: true });
            py.unref();
        } catch (e) {console.log(e);}

        return { ok: true, entryKey, index };
    } catch (err) {
        return { ok: false, error: err?.message ?? String(err) };
    }
});

ipcMain.handle('get-index', async () => {
    try {
        const indexPath = path.join(app.getPath('userData'), 'imports', 'index.json');
        const raw = await fs.readFile(indexPath, 'utf8');
        return { ok: true, index: JSON.parse(raw || '{}') };
    } catch (e) {
        console.log(e);
        return { ok: true, index: {} };
    }
});

ipcMain.handle('delete-entry', async (event, entryKey) => {
    try {
        const destDir = path.join(app.getPath('userData'), 'imports');
        const indexPath = path.join(destDir, 'index.json');
        const raw = await fs.readFile(indexPath, 'utf8');
        const index = JSON.parse(raw || '{}');
        if (!index[entryKey]) return { ok: false, error: 'not found' };
        const filePath = index[entryKey].fileDirectory;
        delete index[entryKey];
        await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');
        try { await fs.unlink(filePath); } catch (e) {}
        return { ok: true, index };
    } catch (e) {
        return { ok: false, error: e?.message ?? String(e) };
    }
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

app.whenReady().then(() => {
  try {
    createWindow();
  } catch (err) {
    console.error('main: createWindow failed', err);
  }

  ensureImportsDirAndIndex().catch(err => {
    console.error('main: ensureImportsDirAndIndex failed', err);

    try {
      const idxPath = getIndexPath();
      fs.writeFile(idxPath, JSON.stringify({}, null, 2), 'utf8').catch(e => console.error('write fallback failed', e));
    } catch (e) {
      console.error('fallback write error', e);
    }
  });
});

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

ipcMain.handle('show-open-dialog', async () => {
    try {
        const res = await dialog.showOpenDialog({ properties: ['openFile'] });
        if (res.canceled || !res.filePaths || res.filePaths.length === 0) return null;
        return res.filePaths[0];
    } catch (err) {
        console.error('main: show-open-dialog error', err);
        return null;
    }
});