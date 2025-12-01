const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("__descartes", {
    closeApp: () => ipcRenderer.send("app-close"),
    openSettings: () => ipcRenderer.send("open-settings"),
    minimizeApp: () => ipcRenderer.send("app-minimize"),
    toggleMaximizeApp: () => ipcRenderer.send("app-toggle-maximize"),
    closeWindow: (windowName) => ipcRenderer.send("close-window", windowName),
    
    importFile: (filePath) => ipcRenderer.send("import-file", filePath),
    getIndex: () => ipcRenderer.invoke("get-index"),
    openFileDialog: () => ipcRenderer.invoke("show-open-dialog"),
    deleteEntry: (entryKey) => ipcRenderer.send("delete-entry", entryKey),

    runDescartes: (entryKey, apiToken) => ipcRenderer.invoke("run-descartes", entryKey, apiToken),

    getDescartesContent: (entryKey) => ipcRenderer.invoke("get-descartes-file", entryKey),

    changeSetting: (settingIndex, content) => ipcRenderer.send("change-setting", settingIndex, content),
    getSetting: (settingIndex) => ipcRenderer.invoke("get-setting", settingIndex)
});

contextBridge.exposeInMainWorld("__apiToken", {
    setAPIToken: (token) => ipcRenderer.invoke("set-api-token", token),
    getAPIToken: () => ipcRenderer.invoke("get-api-token"),
    deleteAPIToken: () => ipcRenderer.invoke("delete-api-token")
});