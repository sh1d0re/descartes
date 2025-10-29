const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('__descartes', {
    closeApp: () => ipcRenderer.send('app-close'),
    openSettings: () => ipcRenderer.send('open-settings'),
    minimizeApp: () => ipcRenderer.send('app-minimize'),
    toggleMaximizeApp: () => ipcRenderer.send('app-toggle-maximize'),
    maximizeApp: () => ipcRenderer.send('app-maximize'),
    unmaximizeApp: () => ipcRenderer.send('app-unmaximize'),
    closeWindow: (windowName) => ipcRenderer.send('close-window', windowName),

    setAPIKey: (key) => ipcRenderer.send('set-api-key', key),
});