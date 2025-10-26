const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('__descartes', {
  ping: () => 'pong',
  closeApp: () => ipcRenderer.send('app-close')
});