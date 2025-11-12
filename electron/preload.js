// Preload script for Electron
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Add any APIs you want to expose to the renderer process here
});
