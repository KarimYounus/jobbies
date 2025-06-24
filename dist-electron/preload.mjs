"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Job application operations
  loadApplications: () => electron.ipcRenderer.invoke("load-applications"),
  saveApplications: (applications) => electron.ipcRenderer.invoke("save-applications", applications),
  checkDataFile: () => electron.ipcRenderer.invoke("check-data-file"),
  // CV collection operations
  loadCVs: () => electron.ipcRenderer.invoke("load-cvs"),
  saveCVs: (cvs) => electron.ipcRenderer.invoke("save-cvs", cvs),
  checkCVDataFile: () => electron.ipcRenderer.invoke("check-cv-data-file"),
  // CV asset operations
  ensureCVAssets: () => electron.ipcRenderer.invoke("ensure-cv-assets"),
  saveImageFile: (fileName, fileBuffer) => electron.ipcRenderer.invoke("save-cv-image", fileName, fileBuffer),
  savePDFFile: (fileName, fileBuffer) => electron.ipcRenderer.invoke("save-cv-pdf", fileName, fileBuffer),
  getCVImageUrl: (imagePath) => electron.ipcRenderer.invoke("get-cv-image-url", imagePath)
});
