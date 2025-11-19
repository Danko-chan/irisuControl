const { ipcMain, BrowserWindow } = require('electron');
const processesService = require('../services/processesService');

ipcMain.handle('process:run', async (_event, { projectPath, scriptName, projectName, shell }) => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  
  const onLog = (id, type, data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('process:log', { id, type, data });
    }
  };

  const onExit = (id, code) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('process:exit', { id, code });
    }
  };

  return processesService.runScript(projectPath, scriptName, projectName, shell, onLog, onExit);
});

ipcMain.handle('process:stop', async (_event, id) => {
  return processesService.stopProcess(id);
});

ipcMain.handle('process:get-all', async () => {
  return processesService.getAllRunningProcesses();
});

ipcMain.handle('process:get-shells', async () => {
  return processesService.getAvailableShells();
});

ipcMain.handle('process:set-shell', async (_event, shell) => {
  processesService.setShellPreference(shell);
  return { success: true };
});

ipcMain.handle('process:get-shell', async () => {
  return processesService.getShellPreference();
});