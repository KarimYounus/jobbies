import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
});

contextBridge.exposeInMainWorld('electronAPI', {
  // Job application operations
  loadApplications: () => ipcRenderer.invoke('load-applications'),
  saveApplications: (applications: any[]) => ipcRenderer.invoke('save-applications', applications),
  checkDataFile: () => ipcRenderer.invoke('check-data-file'),
  
  // CV collection operations
  loadCVs: () => ipcRenderer.invoke('load-cvs'),
  saveCVs: (cvs: any[]) => ipcRenderer.invoke('save-cvs', cvs),
  checkCVDataFile: () => ipcRenderer.invoke('check-cv-data-file'),
  
  // CV asset operations
  ensureCVAssets: () => ipcRenderer.invoke('ensure-cv-assets'),
  saveImageFile: (fileName: string, fileBuffer: ArrayBuffer) => 
    ipcRenderer.invoke('save-cv-image', fileName, fileBuffer),
  savePDFFile: (fileName: string, fileBuffer: ArrayBuffer) => 
    ipcRenderer.invoke('save-cv-pdf', fileName, fileBuffer),
});

// Type definitions for the exposed API
export interface ElectronAPI {
  // Job application operations
  loadApplications: () => Promise<any[]>;
  saveApplications: (applications: any[]) => Promise<void>;
  checkDataFile: () => Promise<boolean>;
  
  // CV collection operations
  loadCVs: () => Promise<any[]>;
  saveCVs: (cvs: any[]) => Promise<void>;
  checkCVDataFile: () => Promise<boolean>;
  
  // CV asset operations
  ensureCVAssets: () => Promise<void>;
  saveImageFile: (fileName: string, fileBuffer: ArrayBuffer) => Promise<string>;
  savePDFFile: (fileName: string, fileBuffer: ArrayBuffer) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
