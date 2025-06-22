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
  // File system operations
  loadApplications: () => ipcRenderer.invoke('load-applications'),
  saveApplications: (applications: any[]) => ipcRenderer.invoke('save-applications', applications),
  checkDataFile: () => ipcRenderer.invoke('check-data-file'),
});

// Type definitions for the exposed API
export interface ElectronAPI {
  loadApplications: () => Promise<any[]>;
  saveApplications: (applications: any[]) => Promise<void>;
  checkDataFile: () => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
