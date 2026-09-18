const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("browserDownloads", {
  getAll: () => ipcRenderer.invoke("downloads:get-all"),
  onUpdated: (callback) => {
    const listener = (_event, downloads) => callback(downloads);
    ipcRenderer.on("downloads-updated", listener);
    return () => ipcRenderer.removeListener("downloads-updated", listener);
  },
});

contextBridge.exposeInMainWorld("nativeBrowser", {
  routeUrl: (url) => ipcRenderer.invoke("browser:route-url", url),
});
