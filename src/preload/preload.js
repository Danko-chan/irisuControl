const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('irisucAPI', {
  // Projects
  getProjects: () => ipcRenderer.invoke('projects:get-all'),
  addProject: () => ipcRenderer.invoke('projects:add'),
  removeProject: (path) => ipcRenderer.invoke('projects:remove', path),
  updateProjectGroup: (projectId, groupId) => ipcRenderer.invoke('projects:update-group', projectId, groupId),
  
  // Groups
  getGroups: () => ipcRenderer.invoke('groups:get-all'),
  createGroup: (name, color) => ipcRenderer.invoke('groups:create', name, color),
  updateGroup: (groupId, updates) => ipcRenderer.invoke('groups:update', groupId, updates),
  deleteGroup: (groupId) => ipcRenderer.invoke('groups:delete', groupId),
  toggleGroupCollapsed: (groupId) => ipcRenderer.invoke('groups:toggle-collapsed', groupId),
  getGroupsCollapsed: () => ipcRenderer.invoke('groups:get-collapsed'),
  
  // Processes
  runScript: (projectPath, scriptName, projectName, shell) => 
    ipcRenderer.invoke('process:run', { projectPath, scriptName, projectName, shell }),
  stopProcess: (id) => ipcRenderer.invoke('process:stop', id),
  getRunningProcesses: () => ipcRenderer.invoke('process:get-all'),
  getAvailableShells: () => ipcRenderer.invoke('process:get-shells'),
  setShellPreference: (shell) => ipcRenderer.invoke('process:set-shell', shell),
  getShellPreference: () => ipcRenderer.invoke('process:get-shell'),
  
  // Events
  onLog: (callback) => ipcRenderer.on('process:log', (_event, data) => callback(data)),
  onExit: (callback) => ipcRenderer.on('process:exit', (_event, data) => callback(data))
});