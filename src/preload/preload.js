const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('irisucAPI', {
  // Projects
  getProjects: () => ipcRenderer.invoke('projects:get-all'),
  addProject: () => ipcRenderer.invoke('projects:add'),
  addProjectByPath: (path) => ipcRenderer.invoke('projects:add-by-path', path),
  removeProject: (path) => ipcRenderer.invoke('projects:remove', path),
  updateProjectGroup: (projectId, groupId) => ipcRenderer.invoke('projects:update-group', projectId, groupId),

  // Recent Projects
  getRecentProjects: () => ipcRenderer.invoke('recent-projects:get-all'),
  trackRecentProject: (projectPath, projectName) => ipcRenderer.invoke('recent-projects:track', projectPath, projectName),

  // Favorites
  getFavorites: () => ipcRenderer.invoke('favorites:get-all'),
  toggleFavorite: (projectPath, projectName, scriptName) => ipcRenderer.invoke('favorites:toggle', projectPath, projectName, scriptName),
  isFavorite: (projectPath, scriptName) => ipcRenderer.invoke('favorites:is-favorite', projectPath, scriptName),

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

  // Logs
  exportLogs: (processId, logs, format, processName, scriptName) =>
    ipcRenderer.invoke('logs:export', { processId, logs, format, processName, scriptName }),

  // Events
  onLog: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('process:log', handler);
    return () => ipcRenderer.removeListener('process:log', handler);
  },
  onExit: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('process:exit', handler);
    return () => ipcRenderer.removeListener('process:exit', handler);
  }
});