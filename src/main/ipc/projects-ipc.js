const { ipcMain, dialog, BrowserWindow } = require('electron');
const projectsService = require('../services/projectsService');
const scriptsService = require('../services/scriptsService');

ipcMain.handle('projects:get-all', async () => {
  const projects = projectsService.getAllProjects();
  return projects.map(project => ({
    ...project,
    scripts: scriptsService.getProjectScripts(project.path)
  }));
});

ipcMain.handle('projects:add', async () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, error: 'No folder selected' };
  }

  return projectsService.addProject(result.filePaths[0]);
});

ipcMain.handle('projects:remove', async (_event, projectPath) => {
  return projectsService.removeProject(projectPath);
});

ipcMain.handle('projects:update-group', async (_event, projectId, groupId) => {
  return projectsService.updateProjectGroup(projectId, groupId);
});

ipcMain.handle('groups:get-all', async () => {
  return projectsService.getAllGroups();
});

ipcMain.handle('groups:create', async (_event, name, color) => {
  return projectsService.createGroup(name, color);
});

ipcMain.handle('groups:update', async (_event, groupId, updates) => {
  return projectsService.updateGroup(groupId, updates);
});

ipcMain.handle('groups:delete', async (_event, groupId) => {
  return projectsService.deleteGroup(groupId);
});

ipcMain.handle('groups:toggle-collapsed', async (_event, groupId) => {
  return projectsService.toggleGroupCollapsed(groupId);
});

ipcMain.handle('groups:get-collapsed', async () => {
  return projectsService.getGroupsCollapsed();
});