import { AppState } from './state/appState.js';
import { ProjectsView } from './ui/projectsView.js';
import { LogsView } from './ui/logsView.js';

const state = new AppState();
const projectsView = new ProjectsView(state);
const logsView = new LogsView(state);

// Initialize
async function init() {
  await state.loadProjects();
  await state.loadGroups();
  await state.loadShells();
  projectsView.render();
  logsView.render();
  
  // Set up listeners
  window.irisucAPI.onLog((data) => {
    state.addLog(data.id, data.data, data.type);
    logsView.render();
  });
  
  window.irisucAPI.onExit((data) => {
    state.markProcessExited(data.id, data.code);
    logsView.render();
  });
}

init();